import {Component, AfterViewInit} from '@angular/core';
import {FeedService} from "../../../../services/feeds.service";
import {FolderService} from "../../../../services/folder.service";
import {GlobalService} from "../../../../services/global.service";


@Component({
    selector: 'header-feed-page',
    templateUrl: 'header-feed-page.html',
})
export class FeedHeaderComponent implements AfterViewInit{
    searchFiles: string;
    privacyUsersVar:any;
    shareFolderPopup:boolean = false;

    constructor (
        public globalService: GlobalService,
        public feedServices: FeedService,
        public folderService: FolderService
    ) {}


    /*Select2 load*/
    ngAfterViewInit() {
        this.privacyUsers();
        this.onChengePrivacy();
    }

    /*Select2 configuration*/
    privacyUsers() {
        this.privacyUsersVar = $('#privacy_users').select2({
            minimumResultsForSearch: Infinity
        });
    }

    onChengePrivacy() {
        this.privacyUsersVar.on('change', (e: any) => {
            this.feedServices.refreshPage = true;
            this.globalService.filterAnimate();
            if($(e.target).val() == 0) {
                this.feedServices.privacyFeed = 0;
                this.feedServices.checkHasFeed(true, true)
            } else {
                this.feedServices.privacyFeed = 1;
                this.feedServices.checkHasFeed(true, true)
            }
        });
    }


    openShareFolderPopup() {
        this.globalService.headerBigerZindex = true;
        this.shareFolderPopup = true;
    }

    closeShareFolder(event) {
        this.shareFolderPopup = event;
        this.globalService.headerBigerZindex = false;
    }

    //Close left column
    closeLeftColumn() {
        this.globalService.leftColumnVisibile = !this.globalService.leftColumnVisibile;
    }
}