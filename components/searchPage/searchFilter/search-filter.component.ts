import {Component, AfterViewInit} from '@angular/core';
import {FeedService} from "../../../services/feeds.service";
import {FolderService} from "../../../services/folder.service";

@Component({
    selector: 'search-filter',
    templateUrl: 'search-filter.html'
})
export class SearchFilterComponent implements AfterViewInit{
    searchFilterVisible: boolean = false;
    constructor(
        public feedServices: FeedService,
        public folderService: FolderService,
    ) {}
    searchTime:any;

    ngAfterViewInit() {
        this.searchTimeSelect();
    }

    /*Folder Select2*/
    private searchTimeSelect() {
        this.searchTime = $('#search-time').select2({
            minimumResultsForSearch: Infinity
        })
    }

    /*Show search filter*/
    showSearchFilter() {
        this.searchFilterVisible = !this.searchFilterVisible;
    }
}