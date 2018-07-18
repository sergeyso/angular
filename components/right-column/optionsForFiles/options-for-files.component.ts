import {Component} from '@angular/core';
import {GlobalService} from "../../../services/global.service";
import {RshService} from "../../../services/rsh.service";
import {FolderService} from "../../../services/folder.service";

@Component({
    selector: 'options-files',
    templateUrl: 'options-for-files.html'
})
export class OptionsForFilesComponent {

    constructor(
        public globalService: GlobalService,
        public rhsService: RshService,
        public folderService: FolderService
    ) {}

    openOptions() {
        this.globalService.optionsFiles = !this.globalService.optionsFiles;
    }

    deleteFiles(type) {
        this.globalService.itsOwnerDelete = type;
        this.globalService.deleteFile = true;
        this.globalService.optionsFiles = false;
    }

    openUpdateContent() {
        this.globalService.optionsFiles = false;
        this.rhsService.showColumn('update');
    }
}