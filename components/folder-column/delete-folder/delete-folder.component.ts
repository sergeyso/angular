import {Component, AfterViewInit, Output, EventEmitter} from '@angular/core';
import {GlobalService} from "../../../services/global.service";
import {FolderService} from "../../../services/folder.service";
import {FolderSelect2} from "../../../models/interfaces/folderSelect2.model";
import {FolderSelect2Directive} from "../../../directive/folders.select2.directive";
@Component({
    selector: 'delete-folder',
    templateUrl: 'delete-folder.html'
})
export class DeleteFolder implements AfterViewInit  {

    deleteFolderVar:any;
    subFolderSelectVar:any;
    folderId:any;
    folders:Array<any>;
    subfolderVisible:boolean = false;
    folderSelect:any;
    subFolderfolders:any = [];

    @Output() callGetAllFolders = new EventEmitter();
    constructor(
        public globalService: GlobalService,
        public folderService: FolderService
    ) {
        this.folders = this.globalService.folders.filter((el) => {
            return el.id !== this.folderService.folderSelectedForDelete;
        });
    }
    hidePopup() {
        this.globalService.deleteFolderForm = false;
    }
    /*Select2 load*/
    ngAfterViewInit() {
        this.deleteFolderSelect();
        this.deletefolderChange();
        this.subFoldersSelect();
        this.subFoldersSelectChange();
    }

    /*Select2 configuration*/
    deleteFolderSelect() {
        this.deleteFolderVar = $('#folder_delete').select2({
            data: this.folders,
            placeholder: "Select destination folder"
        });
    }


    deletefolderChange() {
        this.deleteFolderVar.on('change', (e: any) => {
            let folder = this.folderService.folders.find(value => value.folder.id == $(e.target).val());

            if(!folder) {
                this.folderSelect = null;
                this.subfolderVisible = false;
            } else if(!folder.subfolders.length) {
                this.folderSelect = $(e.target).val();
                this.folderId = $(e.target).val();
                this.subfolderVisible = false;
                this.subFolderfolders = [];
            } else if(folder.subfolders.length) {
                this.folderSelect = $(e.target).val();
                this.folderId = $(e.target).val();
                this.makeSubfolderArray(folder.subfolders);
            }
        });
    }

    private makeSubfolderArray(subfolders: Array<any>) {
        this.subFolderfolders = [];

        let subfoldersArray = subfolders.forEach((item, index) => {
            let folder: FolderSelect2 = FolderSelect2Directive.makeObject(item);
            this.subFolderfolders.push(folder);
        });

        this.subFolderfolders = this.subFolderfolders.filter((el) => {
            return el.id !== this.folderService.folderSelectedForDelete;
        });

        let subfolderSelect = $('#subfolder-delete');
        subfolderSelect.select2().empty();
        subfolderSelect.append("<option></option>");
        this.subFoldersSelect();
        this.subfolderVisible = true;
    }


    /*Folder Select2*/
    private subFoldersSelect() {
        this.subFolderSelectVar = $('#subfolder-delete').select2({
            placeholder: "Select sub folder",
            allowClear: true,
            data: this.subFolderfolders,
        })
    }

    /*Folder Select2*/
    private subFoldersSelectChange() {
        this.subFolderSelectVar.on('change', (e: any) => {
            let id = $(e.target).val();
            if(id) {
                this.folderSelect = id;
            } else {
                this.folderSelect = this.folderId;
            }
        });
    }

    /**
     * Delete folder
     */
    deleteFolder() {
        this.folderService.deleteFolder(this.folderSelect).subscribe(
            (successfully: Response) => {
                this.folderService.selectedFolder('', '', 'root', '');
                this.globalService.folders = this.mapsFolders();
                this.callGetAllFolders.emit();
                this.globalService.deleteFolderForm = false;
            },
            (err: any) => {
                console.log(err)
            });
    }

    mapsFolders() {
        return this.globalService.folders.filter(e => {
            return e.id != this.folderService.folderSelectedForDelete;
        });
    }


    deleteFolderAll() {
        this.folderSelect = null;
        this.deleteFolder();
    }
}