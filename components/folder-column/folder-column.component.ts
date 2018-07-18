import {Component, OnInit, ViewChild} from '@angular/core';
import {GlobalService} from "../../services/global.service";
import {Folder} from "../../models/class/folder.model";
import {FolderService} from "../../services/folder.service";
import {SubFolder} from "../../models/class/sub_folder.model";
import {SectorService} from "../../services/sector.service";

@Component({
    selector: 'folder-column',
    templateUrl: 'folder-column.html',
    styleUrls: ['folder-column.scss']
})
export class FolderColumn implements OnInit {
    folder: Folder = new Folder();
    subFolder: SubFolder = new SubFolder();
    folders: any;
    folderFormVisible: boolean = false;
    deleteFolderIconsVisible: boolean = false;
    @ViewChild('mainBox') mainBox: ViewChild;

/*    ws = new WebSocket(`wss://notify.planetjuno.com/socket?auth=${btoa(this.global.login.credentials[0]+":"+this.global.login.credentials[1])}`);*/

    constructor(
        public global: GlobalService,
        public folderService: FolderService,
        public sectorService: SectorService
    ) {}

    ngOnInit() {
        this.global.checkShowMyContent();
        this.openSocket();
    }

    openSocket() {
        // this.ws.onmessage = (event) => {
        //     this.addNotificationsToFolders(JSON.parse(event.data).data);
        // };
    }

    private addNotificationsToFolders(data) {
        this.folderService.rootFolderNotify = data.find(a => a.folder_id == null);
        this.folderService.folders.map(value => {
            let objectFolder = data.find(a => a.folder_id == value.folder.id);
            if(objectFolder) {
                value.notifications = objectFolder.col_new_files;

            }
            let subfolders = value.subfolders;
            if(subfolders.length) {
                subfolders.map(subfolder => {
                    let objectSubFolder = data.find(a => a.folder_id == subfolder.folder.id);
                    if(objectSubFolder) {
                        subfolder.notifications = objectSubFolder.col_new_files;
                    }
                });
            }
        });
    }

    createFolder(folder, key: number = null) {
        this.global.postRquest(this.global.apiUrl+'folders', folder).subscribe(
            (successfully: Response) => {
                this.removeInstanceOfFolder(folder);
                this.folderService.getAllFolderFunct().then();
            },
            (err: any) => {
                console.log(err)
            });
    }

    //Edit folder name
    editFolderName() {
        this.global.postRquest(this.global.apiUrl+'folders/'+this.folderService.folderSelectedForEdit.id, {
            name: this.folderService.folderSelectedForEditName
        }).subscribe(
            (successfully: Response) => {
                //this.removeInstanceOfFolder(folder);
                this.folderService.getAllFolderFunct().then();
                this.global.folderObject.folder = successfully.response_data[0];
                this.remapBreadcrumbs();
                this.folderService.editfolderFormVisible = null;
            },
            (err: any) => {
                console.log(err)
            });
    }

    remapBreadcrumbs() {
        this.folderService.arrayBreadCump.map(a => {
            if(a.key == this.global.folderObject.folder.hash_id) {
                a.name = this.global.folderObject.folder.name
            }
            return a;
        });
    }

    getAllFolder() {
        this.folderService.getAllFolder().subscribe(
            (successfully: Response) => {
                this.folderService.folders = successfully.response_data;
                this.global.finishFolders = true;
                this.global.deleteFolderForm = false;
            },
            (err: any) => {
                console.log(err)
            });
    }

    removeInstanceOfFolder(folder): void {
        if(folder instanceof Folder) {
            this.folder = new Folder();
            this.folderFormVisible = false;
        } else if(folder instanceof SubFolder) {
            this.subFolder = new SubFolder();
            this.folderService.subfolderFormVisible = null;
        }
    }

    //Open add new form
    addNewSubFolderForm(index: number, id: any): void {
        if(this.folderService.subfolderFormVisible == null) {
            this.folderService.subfolderFormVisible = index;
            this.subFolder.folder_id = id;
            this.folderService.editfolderFormVisible = null;
        } else {
            this.folderService.subfolderFormVisible = null;
            this.subFolder = new SubFolder();
        }
    }

    //Edit folder/subfolder
    editFolderForm(index: number, folder: any, folderlevel): void {
        switch (folderlevel) {
            case'folder':
                if(this.folderService.editfolderFormVisible == null) {
                    this.folderService.editfolderFormVisible = index;
                    this.folderService.folderSelectedForEdit = folder;
                    this.folderService.folderSelectedForEditName = folder.name;
                    this.folderService.subfolderFormVisible = null;
                } else {
                    this.folderService.editfolderFormVisible = null;
                }
                break;
            case'subfolder':
                if(this.folderService.editSubfolderFormVisible == null) {
                    this.folderService.editSubfolderFormVisible = index;
                    this.folderService.folderSelectedForEdit = folder;
                    this.folderService.folderSelectedForEditName = folder.name;
                } else {
                    this.folderService.editSubfolderFormVisible = null;
                }
                break;
        }
    }


    folderForm() {
        this.folderFormVisible = !this.folderFormVisible;
    }

    //Show delete icons before folder name
    showDeleteIcons() {
         this.deleteFolderIconsVisible = !this.deleteFolderIconsVisible;
    }

    //Delete folder
    deleteFolder(id) {
        this.folderService.folderSelectedForDelete = id;
        this.global.deleteFolderForm = !this.global.deleteFolderForm;
    }

    onDrop(data: any, folder:any, folderSelectedId) {
        let lastBred = this.folderService.arrayBreadCump[this.folderService.arrayBreadCump.length - 1];
        if(lastBred.index != 'root') {
            this.global.filterAnimate();
        }
        this.global.postRquest(this.global.apiUrl+'files/'+data.id, {
            folder_id: folder == 'root' ? '' : folder.id
        }).subscribe(
            successfully => {
                this.folderService.getAllFolderFunct().then();
                if(lastBred.index != 'root') {
                    this.folderService.clickReturnByFile = true;
                    this.folderService.selectedFolder(lastBred.index, lastBred.key, lastBred.type, lastBred.object, true);
                }
            }
        );
    }

    unshareFolder(folder) {
        try {
            this.global.postRquest(this.global.apiUrl+'folders/delete-self-access/'+folder.id, {}).subscribe(
                (successfully: Response) => {
                    this.folderService.getAllFolderFunct().then();
                    if(this.folderService.folderIdSelected == folder.id) {
                        this.folderService.select('root', '', 'root', '');
                    }
                },
                (err: any) => {
                    console.log(err)
                });
        } catch (e) {
            console.error(e);
        }
    }
}