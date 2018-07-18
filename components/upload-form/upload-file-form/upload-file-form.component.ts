import {Component, EventEmitter, Input, Output, OnChanges} from '@angular/core';
import {FileUploader} from "ng2-file-upload";
import {ChannelService} from "../../../services/channel.service";
import {GlobalService} from "../../../services/global.service";
import {PostService} from "../../../services/post.service";
import {Response} from "@angular/http";
import {FeedService} from "../../../services/feeds.service";
import {FolderService} from "../../../services/folder.service";
import {Access} from "../../../models/class/access/file.model";

@Component({
    selector: 'upload-file-form',
    templateUrl: 'upload-file-form.html'
})
export class UploadFileFormComponent implements OnChanges {
    @Output() close = new EventEmitter();
    @Output() zindex = new EventEmitter();
    @Input() recFile: any = null;
    note: string = '';
    uploader: FileUploader = new FileUploader({autoUpload: false});
    hasBaseDropZoneOver: boolean = false;
    errorMessage: string = '';
    files: Array<any> = [];
    securityModalStatus: boolean = false;
    selectChannelsVar: boolean = false;
    searchChannelsInput: string = '';
    channel: string = 'General';
    channel_id: number = null;
    selectPrivacyVar: boolean = false;
    privacy_id: number = 1;
    searchContactInput: string = '';
    selectContacts: Array<any> = [];
    emails: any = '';
    selectedContacts: Array<any> = [];
    uploadPreview: number = null;
    previewError: string = '';

    constructor(public channelService: ChannelService,
                public globalService: GlobalService,
                private postService: PostService,
                private feedService: FeedService,
                private folderService: FolderService) {
        if (this.channelService.channel !== false) {
            this.inviteChannel(this.channelService.channel);
        }
    }

    ngOnChanges() {
        if (this.recFile != null) {
            this.files.push(this.recFile);
        }
    }

    fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    savePreview(index: number) {
        this.uploadPreview = null;
        this.files[index].preview = this.files[index].preview_image;
    }

    openUploadPreview (index: number) {
        this.uploadPreview = this.uploadPreview === index ? null : index;
    }

    removePreviewFile (index: number) {
        this.files[index].preview_image = false;
        this.files[index].preview = false;
    }

    addCoverPhoto (event: any, index: number) {
        if (this.imageFile(event.target.files[0])) {
            this.files[index].preview_image = event.target.files[0];
        } else {
            this.previewError = 'Choose image file';
            setTimeout(() => {
                this.previewError = '';
            }, 3000);
        };
    }

    onChangeMultipleFile(event) {
        this.addDataToObject(event.target.files);
        event.srcElement.value = '';
    }

    addDataToObject(files) {
        for (let i = 0, f; f = files[i]; i++) {
            if (this.file(f)) {
                if (f.type.split('/')[0] === 'video') {
                    f.isVideo = true;
                } else {
                    f.isVideo = false;
                }
                this.files.push(f);
            } else {
                this.errorMessage = 'File with that extension it\'s not supported at the moment';
                setTimeout(() => {
                    this.errorMessage = '';
                }, 5000);
            }
        }
    }

    private file(btn) {
        const ext = btn.name.split('.').pop().toLowerCase();
        return $.inArray(ext,
            [
                'png',
                'jpg',
                'jpeg',
                'mp4',
                'webm',
                'flv',
                'mov',
                'avi',
                'docx',
                'xlsx',
                'pptx',
                'doc',
                'xls',
                'ppt',
                'pdf',
                'gif'
            ]
        ) > -1;
    }

    private imageFile(file) {
        if (file.type.split('/')[0] === 'image'){
            return true;
        }
        return false;
    }

    showSecurity() {
        this.securityModalStatus = true;
        this.zindex.emit(110);
    }

    closeSecurity(status: boolean) {
        this.securityModalStatus = !status;
        this.zindex.emit(100);
    }

    inviteChannel(channel): void {
        this.channel_id = channel.id;
        this.channel = channel.name;
        this.selectChannelsVar = false;
    }


    selectChannels() {
        this.selectChannelsVar = !this.selectChannelsVar;
        this.selectPrivacyVar = false;
    }

    selectContactsArray(event, object): void {
        if (event) {
            this.selectContacts.push(object);
        } else {
            const index = this.selectContacts.indexOf(object);
            this.selectContacts.splice(index, 1);
        }
    }

    selectPrivacy() {
        this.selectedContacts = this.selectContacts.slice();
        this.selectPrivacyVar = !this.selectPrivacyVar;
        this.selectChannelsVar = false;
    }

    toggleFilePostFormEmit(value) {
        this.close.emit(value);
    }

    removeFile(index: number) {
        this.files.splice(index, 1);
    }

    createPost() {
        const data = this.filesObject();
        const formData: FormData = new FormData();

        for (const i in data) {
            if (data[i]) {
                formData.append(i, data[i]);
            }
        }
        this.postService.createFilePost(formData)
            .subscribe(
                (repsponse: Response) => {
                    this.feedService.refreshPage = true;
                    if (this.channelService.channel !== false) {
                        this.folderService.select(this.channelService.channelSelected, this.channelService.channel.id,
                            'channel', this.channelService.channel);
                    } else {
                        this.folderService.select('root', '', 'root', '');
                    }
                    this.close.emit(false);
                }
            );
    }

    private filesObject(): Object {
        const fileObject = {};
        this.files.forEach((value, index) => {
            fileObject[`LibraryFile[${index}][name]`] = value.name;
            fileObject[`LibraryFile[${index}][description]`] = this.note;
            fileObject[`LibraryFile[${index}][channel_id]`] = this.channel_id;
            fileObject[`LibraryFile[file_content][${index}]`] = value;
            fileObject[`LibraryFile[${index}][access]`] = JSON.stringify(new Access(this.accessStructure().accessUser));
            fileObject[`LibraryFile[${index}][privacy_id]`] = this.privacy_id;
            if (value.preview) {
                fileObject[`LibraryFile[preview][${index}]`] = value.preview;
            }
        });
        this.emails = this.emails.split(',').filter(
            (email) => {
                return email.trim();
            }
        );
        fileObject['emails'] = JSON.stringify(this.emails.map(
            (email) => {
                return email.trim();
            }));
        return fileObject;
    }

    private accessStructure() {
        const objectInteger: Object = {};
        if (this.selectContacts.length) {
            this.selectContacts.forEach((a: any, e) => {
                objectInteger[a.contact_user.id] = ['read'];
            });
        }

        return {
            accessUser: objectInteger,
        };
    }
}
