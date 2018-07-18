import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../../services/global.service";
import {FolderService} from "../../services/folder.service";
import {FeedService} from "../../services/feeds.service";

@Component({
    selector: 'app',
    templateUrl: 'search-page.html'
})
export class SearchPage implements OnInit {
    search: string = '';

    /**
     * @param {GlobalService} global
     * @param {FolderService} folderService
     * @param {FeedService} feedServices
     */
    constructor(
        public global: GlobalService,
        public folderService: FolderService,
        public feedServices: FeedService
    ) {
        global.finishFolders = true;
    }

    /**
     * OnInit
     */
    ngOnInit() {
        this.search = this.global.search;
    }

    /**
     * Submit search
     */
    submitSearch() {
        this.feedServices.onSubmitSearch(this.search);
    }

    /**
     * Change Search
     */
    searchChangeInput(event) {
        history.pushState(null, null, `search?search=${event}`);
    }

    /**
     * Close left column
     */
    closeLeftColumn() {
        this.global.leftColumnVisibile = !this.global.leftColumnVisibile;
    }
}