import {Component} from '@angular/core';
import {GlobalService} from "../../services/global.service";
import {FolderService} from "../../services/folder.service";
import {FeedService} from "../../services/feeds.service";

@Component({
    selector: 'app',
    templateUrl: 'answers-page.html'
})
export class AnswersPage {
    constructor(
        public global: GlobalService,
        public folderService: FolderService,
        public feedServices: FeedService,
    ) {}
}