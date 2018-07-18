import {Component} from '@angular/core';
import {GlobalService} from "../../../services/global.service";

@Component({
    selector: 'header-app',
    templateUrl: 'header-feed-main.html',
})
export class FeedHeaderMainComponent {
    constructor(
        public globalService: GlobalService
    ) {}
}