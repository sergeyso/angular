/**
 * Created by radmilla on 22/01/2017.
 */
import {Directive, Input} from '@angular/core';
import {FolderSelect2} from "../models/interfaces/folderSelect2.model";
import {GlobalService} from "../services/global.service";
import {FolderService} from "../services/folder.service";

@Directive({
    selector: '[folders]',
})

export class FolderSelect2Directive {
    constructor(
        private global: GlobalService,
        private folderService: FolderService
    ) {}

    @Input() set folders(value) {
        try {
            if('files_in_parent' in value) {
                this.folderService.countFolderRoot = value.files_in_parent;
            }
            let folder: FolderSelect2 = FolderSelect2Directive.makeObject(value);
            let find = this.findObject(folder);
            if(!find) {
                this.global.folders.push(folder);
            }
/*            this.folderService.foldersSelect(this.global.folders);
            $("#upload-folders option[value='"+this.folderService.folderSelectedForDelete+"']").remove();*/
        } catch (e) {
            console.error(e);
        }

    }

    /**
     * @param value
     * @returns {{id: any, text: string}}
     */
    public static makeObject(value) {
        return {
            id: value.folder.id,
            text: value.folder.name,
        };
    }

    /**
     * @param folder
     * @returns {{id: any, text: string}|any}
     */
    private findObject(folder) {
        return this.global.folders.find(value => value.id == folder.id);
    }
/*

    checkHasWriteAccess(folder) {
        try {
            if (this.global.login.data.id in folder.access.users) {
                let user = folder.access.users[this.global.login.data.id];
                return user.indexOf("write") != -1
            } else {
                this.global.itsOwner = false;
            }
        } catch (e) {
            // Else remove template from DOM
            return false;
        }
    }*/
}