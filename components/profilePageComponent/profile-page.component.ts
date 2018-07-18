import {Component, AfterViewInit} from '@angular/core';
import {GlobalService} from "../../services/global.service";
import {FolderService} from "../../services/folder.service";
import {FeedService} from "../../services/feeds.service";

@Component({
    selector: 'profile',
    templateUrl: 'profile-page.html',
    styleUrls: ['profile-page.scss']
})
export class ProfilePage {
    constructor(
        public global: GlobalService,
        public folderService: FolderService,
        public feedServices: FeedService
    ) {
        global.finishFeed = false;
        global.finishFolders = true;
     }
}