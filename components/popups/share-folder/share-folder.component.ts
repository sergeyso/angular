import {Component, Output, EventEmitter} from '@angular/core';
import {GlobalService} from '../../../services/global.service';
import {NgForm, NgModel} from '@angular/forms';
import {ValidationForm} from '../../../helpers/validation';
import {Folder} from '../../../models/class/folder.model';
import {UploadService} from '../../../services/uploadFile.service';
import {SideBarFolder} from '../../../models/class/folder/SideBarFolder';
import {LinkFolder} from '../../../models/class/folder/LinkFolder';
import {ResponseApi} from '../../../models/interfaces/responseApi.interface';
import {readUrl} from '../../../helpers/readFile';

@Component({
    selector: 'share-folder-popup',
    templateUrl: 'share-folder.html'
})
export class ShareFolderPopup {
    // Create event emitter to emit click on parent component
    @Output() closePopup: EventEmitter<boolean> = new EventEmitter();
    search: number = 0;
    folder = this.globalService.folderObject.folder;
    shared: boolean = this.checkIsShared();
    requiredHeaderArt: boolean = true;
    header_art: string = '';
    header_artOld: any = this.globalService.folderObject.folder.header_art;
    submitShareOptions: boolean = false;
    submitSidebar: boolean = false;
    submitLinks: boolean = false;
    updateFolder: Folder = new Folder();
    progress: any;
    links: Array<any> = [];
    sideBar: SideBarFolder = new SideBarFolder();
    selectedTab: number = 1;
    url: string = `${this.globalService.apiUrl}folders/${this.folder.id}`;
    imageUrl: string = 'images/default.png';
    uniqueMessage: string = '';
    hasSidebar: boolean = false;
    constructor(
        public globalService: GlobalService,
        private uploadService: UploadService,
    ) {
        this.uploadService.progress$.subscribe((data: number) => {
            this.progress = data;
        });
        this.prepareUpdateFolder();
        this.checkHasTemplate();
        this.checkHasHeaderArt();
    }

    /**
     * Prepare object for updating
     */
    prepareUpdateFolder(): void {
        this.updateFolder.id = this.folder.id;
        this.updateFolder.name = this.folder.name;
        this.updateFolder.route = this.folder.route;
        this.updateFolder.search = this.folder.search;
        this.updateFolder.Templatefolder = this.folder.template;
        this.links = this.folder.links;
        if (this.folder.sideBar) {
            this.hasSidebar = true;
            this.getImage();
            this.sideBar = this.folder.sideBar;
            delete this.sideBar.image;
        }
    }

    // Close popup and pass value to emitter
    hidePopup(): void {
        this.closePopup.emit(false);
    }

    shareFolderPopup(form: NgForm): void {
        this.submitShareOptions = true;
        if (form.valid) {
            this.updateFolder.search = this.updateFolder.search ? '1' : '0';
            this.updateFolder.access = this.addAccess(form.value);
            this.updateFolder['Templatefolder[view_type]'] = this.updateFolder.Templatefolder.view_type;
            this.fileRequest(this.updateFolder);
        }
    }

    /**
     * Access on the folder
     * @param val
     * @return {string}
     */
    addAccess(val) {
        const publicAccess = this.globalService.folderObject.folder.access;
        if (val.shared) {
            publicAccess.other = ['read'];
        } else {
            publicAccess.other = []
        }
        return JSON.stringify(publicAccess);
    }

    checkIsShared() {
        try {
            return this.folder.access.other.indexOf('read') > -1;
        } catch (e) {
            return false;
        }
    }

    checkHasTemplate(): void {
        if (!this.folder.template) {
            this.updateFolder.Templatefolder = {
                view_type: ''
            }
        }
    }

    /**
     * @return {boolean}
     */
    checkHasHeaderArt() {
        if (this.folder.header_art) {
            return this.requiredHeaderArt = false;
        }

        return this.requiredHeaderArt = true;
    }

    getFilesHeaderArt(event, header_artInput: NgModel) {
        const validation = new ValidationForm();
        this.requiredHeaderArt = false;
        this.updateFolder.header_art = event.target.files[0];
        this.header_art = event.target.files[0].name;
        validation.checkExtension(event, header_artInput, 'image');
    }

    /**
     * Remove Header Art
     * @param {NgModel} file
     */
    removeHeaderArt(file: NgModel) {
        if (!this.header_artOld) {
            this.requiredHeaderArt = true;
        }
        this.updateFolder.header_art = null;
        $('#add-files').val('');
        this.header_art = '';
        file.control.clearValidators();
        file.control.setErrors(null);
    }

    /**
     * Add new empty link
     */
    addEmptyLink() {
        this.links.push(new LinkFolder())
    }

    /**
     * Delete Link
     * @param index
     */
    removeLink(index): void {
        this.links.splice(index)
    }

    /**
     * Request to update Folder Links
     */
    async foldersLinkRequest() {
        this.submitLinks = true;
        if (await this.validationLinks()) {
            this.fileRequest({
                syncLinks: await JSON.stringify(this.links).replace(/(,?{})/g, '')
            });
        }
    }

    /**
     * Request to update Sidebar
     * @param {NgForm} sideBarForm
     */
    foldersSideBarRequest(sideBarForm: NgForm): void {

        if (sideBarForm.valid || (!this.sideBar.title.length && !this.sideBar.text.length)) {
            this.submitSidebar = false;
            this.fileRequest({
                'sideBar[title]': this.sideBar.title ? this.sideBar.title : ' ',
                'sideBar[text]': this.sideBar.text ? this.sideBar.text : ' ',
                sideBarImage: this.sideBar.sideBarImage,
            });
        } else {
            this.submitSidebar = true;
        }
    }

    /**
     * On change input
     * @param event
     *
     * @return {void}
     */
    onChangeFileSidebar(event): void {
        this.sideBar.sideBarImage = event.target.files[0];
        readUrl(event).then(
            (isSuccess: any) => {
                this.imageUrl = isSuccess;
            }
        )
    }


    /**
     * Remove Image
     */
    removeImageSiderBar(): void {
        this.sideBar.sideBarImage = ' ';
        this.imageUrl = 'images/default.png';
    }


    /**
     * Http request with file
     * @param object
     */
    private fileRequest(object: any) {
        this.uploadService.upload(object, this.url).subscribe(
            (uploads: ResponseApi) => {
                this.globalService.folderObject.folder = uploads.response_data[0];
                this.closePopup.emit(false);
            },
            (err: string) => {
                const objectError = JSON.parse(err);
                if (objectError.hasOwnProperty('response_data')) {
                    this.uniqueMessage = 'That name already exists. Please use a different one.';
                    setTimeout(() => {
                        this.uniqueMessage = '';
                    }, 3000);
                }
                console.error(err);
            });
    }

    /**
     * GetImage Sidebar
     */
    private getImage() {
        try  {
            if (this.folder.sideBar.image) {
                this.imageUrl = this.folder.sideBar.image.link;
            }
        } catch (e) {
            this.imageUrl = 'images/default.png';
        }
    }

    /**
     * Validation Links
     * @return {Promise<boolean>}
     */
    private validationLinks(): Promise<boolean>  {
        let condition = true;
        return new Promise((resolve, reject) => {
            this.links.map(value => {
                if (value.hasOwnProperty('error') && value.error) {
                    condition = false;
                }
                value.first = false;
                return value;
            });

            resolve(condition);
        });
    }


    /**
     * Delete Sidebar
     */
    deleteSidebar() {
        this.globalService.postRquest(`${this.globalService.apiUrl}folders/delete-sidebar/${this.folder.id}`, {})
            .subscribe(
                (isSuccess: ResponseApi) => {
                    this.globalService.folderObject.folder = isSuccess.response_data;
                }, (err: string) => {
                    this.closePopup.emit(false);
                    console.error(err);
                }, () => {
                    this.closePopup.emit(false);
                }
            );
    }
}
