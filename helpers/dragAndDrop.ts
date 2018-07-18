import {FileTable} from "../models/class/fileTableUploadForm.model";
import {FieldObject} from "../models/class/upload/fieldObject";
import {FolderService} from "../services/folder.service";
import {GlobalService} from "../services/global.service";
import {FolderSelect2} from "../models/interfaces/folderSelect2.model";
import {FolderSelect2Directive} from "../directive/folders.select2.directive";
import {Folder} from "../models/class/folder.model";
declare let $: any;
/**
 * Created by t_mit on 4/21/2017.
 */
export class DragAndDrop {

    constructor(
        public globalService: GlobalService,
        public folderService: FolderService,
    ) {}

    files: Array<any> = [];
    errorMessage: string = '';
    fileTable: FileTable = new FileTable();


    onChangeFileMultiple(event) {
        this.addDataToObject(event.target.files);
    }

    drop(e) {
        this.addDataToObject(e.dataTransfer.files);
        e.preventDefault();
        if ( e.target.className == "draggable-area active" ) {
            e.target.classList.remove('active');
        }
    }

    addDataToObject(files) {
        for (let i = 0, f; f = files[i]; i++) {
            if(this.file(f)) {
                this.files.push(new FileTable(
                    new FieldObject(f.name),
                    new FieldObject(),
                    new FieldObject(f.name),
                    f,
                    new FieldObject('', false),
                    new FieldObject(),
                    new FieldObject(),
                    new FieldObject(),
                    new FieldObject('Private', true, []),
                ));
                this.foldersSelect(this.files.length - 1);
                this.subFoldersSelectTimeout(this.files.length - 1);
            } else {
                this.errorMessage = 'File with that extension it\'s not supported at the moment';
                setTimeout(() => { this.errorMessage = ''; }, 5000);
            }
        }
    }

    dragover(e) {
        e.preventDefault();
        if ( e.target.className == "draggable-area" ) {
            e.target.classList.add('active');
        }
    }

    dragleave(e) {
        e.preventDefault();
        if ( e.target.className == "draggable-area active" ) {
            e.target.classList.remove('active');
        }
    }

    dropprevent(e) {
        e.preventDefault();
        if ( e.target.className == "draggable-area active" ) {
            e.target.classList.remove('active');
        }
    }


    private file(btn)
    {
        let ext = btn.name.split('.').pop().toLowerCase();
        return $.inArray(ext, ['png', 'jpg', 'jpeg', 'mp4', 'webm', 'flv', 'mov', 'avi', 'docx', 'xlsx', 'pptx', 'doc', 'xls', 'ppt', 'pdf', 'gif']) > -1;
    }

    /*Folder Select2*/
    private foldersSelect(key) {
        setTimeout(() => {
            this.files[key].folder_id.selected = this.foldersSelect2(key);
            this.files[key].folder_id.selected.on('change', (e: any) => {
                this.resetSubFolderSelect(key);
                let folder = this.folderService.folders.find(value => value.folder.id == $(e.target).val());
                if(!folder) {
                    if($(e.target).val() == 'My Content') {
                        this.files[key].folder_id.name = null;
                        this.files[key].folder_name.name = null;
                    } else {
                        this.files[key].folder_id.disabled = true;
                        let newFolder = new Folder(
                            $(e.target).val()
                        );
                        this.createFolder(newFolder).then(sucess => {
                            this.files[key].folder_id.name = sucess;
                            this.folderService.getAllFolderFunct().then(
                                isSucess => {
                                    this.files[key].folder_id.disabled = false;
                                }
                            );
                        });
                        this.files[key].folder_name.name = $(e.target).val();
                    }
                    this.files[key].subfolder_id.disabled = true;
                } else if(!folder.subfolders.length) {
                    this.files[key].folder_id.name = $(e.target).val();
                    this.files[key].folder_name.name = folder.folder.name;
                    this.files[key].subfolder_id.disabled = true;
                } else if(folder.subfolders.length) {
                    this.files[key].folder_id.name = $(e.target).val();
                    this.files[key].folder_name.name = folder.folder.name;
                    this.makeSubfolderArray(folder.subfolders, key);
                }
            });
        }, 5);
    }

    private makeSubfolderArray(subfolders: Array<any>, key) {
        this.files[key].subfolder_name.name = [];
        let subfoldersArray = subfolders.forEach((item, index) => {
            let folder: FolderSelect2 = FolderSelect2Directive.makeObject(item);
            this.files[key].subfolder_name.name.push(folder);
        });

        let subfolderSelect = $(`#upload-subfolders${key}`);
        subfolderSelect.select2().empty();
        subfolderSelect.append("<option></option>");
        this.subFoldersSelect(key);
        this.files[key].subfolder_id.disabled = false;
    }


    /*Folder Select2*/
    foldersSelect2(key) {
        return $(`#upload-folders${key}`).select2({
            tags: true,
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange",
        }).trigger('change');
    }

    subFoldersSelectTimeout(key) {
        setTimeout(() => {
            this.subFoldersSelect(key);
        }, 5);
    }

    /*Folder Select2*/
    private subFoldersSelect(key) {
        this.files[key].subfolder_id.selected = $(`#upload-subfolders${key}`).select2({
            data: this.files[key].subfolder_name.name,
            placeholder: "Select sub folder",
            allowClear: true,
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange",
            minimumResultsForSearch: Infinity
        });

        this.subFoldersSelectChange(key);
    }

    private resetSubFolderSelect(key) {
        this.files[key].subfolder_id.name = null;
        this.files[key].subfolder_name.name = [];
        let subfolderSelect = $(`#upload-subfolders${key}`);
        subfolderSelect.select2().empty();
        subfolderSelect.append("<option></option>");
        this.subFoldersSelect(key);
    }

    /*Folder Select2*/
    private subFoldersSelectChange(key) {
        this.files[key].subfolder_id.selected.on('change', (e: any) => {
            let folder = this.files[key].subfolder_name.name.find(value => value.id == $(e.target).val());
            let id = $(e.target).val();
            if(id) {
                this.files[key].subfolder_id.name = id;
            } else {
                this.files[key].subfolder_id.name = null;
            }
        });
    }

    private createFolder(folder) {
        return new Promise((resolve, reject) => {
            this.globalService.postRquest(this.globalService.apiUrl+'folders', folder).subscribe(
                (successfully: Response) => {
                    resolve(successfully.response_data[0].id)
                },
                (err: any) => {
                    console.log(err)
                });
        });
    }
}