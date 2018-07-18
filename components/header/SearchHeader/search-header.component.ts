import {Component} from '@angular/core';
import {FeedService} from "../../../services/feeds.service";
import {GlobalService} from "../../../services/global.service";

@Component({
    selector: 'header-app',
    templateUrl: 'search-header.html',
})
export class SearchHeader {
    constructor(
        public globalService: GlobalService,
        public feedServices: FeedService
    ) {
        this.searchFiles = this.globalService.search;
    }

    searchFiles: string;

    onSubmit() {
        this.feedServices.onSubmitSearch(this.searchFiles);
    }

    clearSearch() {
        this.searchFiles = '';
        this.onSubmit();
    }
}