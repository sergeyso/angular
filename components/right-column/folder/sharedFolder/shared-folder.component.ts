import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../../../../services/global.service";
import {SharedService} from "../../../../services/shared.service";
@Component({
    selector: 'right-folder-shared-column',
    templateUrl: 'sharedFolder.html'
})
export class SharedFolderRightColumn implements OnInit {
    constructor(
        public globalService: GlobalService,
        public sharedService: SharedService,
    ) {
        sharedService.checkSharedPublic(this.globalService.folderObject.folder, 'contribute');
    }

    ngOnInit() {
        this.sharedService.isShared();
    }
}