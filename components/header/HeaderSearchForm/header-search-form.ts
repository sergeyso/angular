import {Component} from '@angular/core';
import {FeedService} from "../../../services/feeds.service";

@Component({
    selector: 'header-search-form',
    templateUrl: 'header-search-form.html',
})
export class HeaderSearchForm {
    searchFormVisible: boolean = false;
    searchFiles: string = '';
    constructor (
        public feedServices: FeedService
    ) {}

    // Open search form
    openSearchForm() {
        this.searchFormVisible = !this.searchFormVisible;
    }

    onSubmit() {
        if(this.searchFiles) {
            this.feedServices.onSubmitSearch(this.searchFiles);
        }
    }

}