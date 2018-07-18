import {Component} from '@angular/core';
import {FeedService} from "../../../services/feeds.service";
import {GlobalService} from "../../../services/global.service";

@Component({
    selector: 'header-app',
    templateUrl: 'answers-header.html',
})
export class AnswersHeader {
    constructor(
        public globalService: GlobalService,
        public feedServices: FeedService
    ) {}
}