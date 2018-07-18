import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {GlobalService} from '../../services/global.service';
import {FeedService} from '../../services/feeds.service';
import {FolderService} from '../../services/folder.service';
import {RshService} from '../../services/rsh.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SectorService} from "../../services/sector.service";

@Component({
    selector: 'feeds',
    templateUrl: 'feeds.html',
    styleUrls: ['feeds.scss']
})
export class FeedComponent implements OnInit {
    optionFilesVisible: number = null;
    @ViewChild('clickOptionsFile') clickOptionsFile;
    editFileVisible: boolean = false;

    constructor(
        public global: GlobalService,
        public feedService: FeedService,
        public folderService: FolderService,
        public rshService: RshService,
        public sectorService: SectorService
    ) {}

    ngOnInit() {
        this.showFeed();
        this.onScroll();
    }

    private showFeed() {
        if (this.global.processFeed === true) {
            if (this.folderService.folderSelectedBoolean) {
                this.folderService.select(
                    this.folderService.folderSelectedObject.index,
                    this.folderService.folderSelectedObject.key,
                    this.folderService.folderSelectedObject.type,
                    this.folderService.folderSelectedObject.object,
                )
            } else if (this.global.file) {
                this.feedService.removeLoadMore(false);
                this.global.finishFeed = true;
                this.folderService.showFile(this.global.file);
                this.global.showColumn(this.global.file, 0)
            } else {
                this.feedService.checkHasFeed();
            }
        }
    }

    private onScroll() {
        window.onscroll = () => {
            const windowHeight = 'innerHeight' in window ? window.innerHeight
                : document.documentElement.offsetHeight;
            const body = document.body, html = document.documentElement;
            const docHeight = Math.max(body.scrollHeight,
                body.offsetHeight, html.clientHeight,
                html.scrollHeight, html.offsetHeight);
            const windowBottom = windowHeight + window.pageYOffset;

            if (windowBottom >= docHeight && !this.global.showUploadForm && !this.feedService.load) {
                if (this.global.processFeed === true) {
                    this.feedService.removeLoadMore(true);
                    if (this.folderService.folderIdSelected) {
                        this.folderService.getFilesFromFilteredFolder();
                    } else {
                        this.feedService.checkHasFeed(this.global.processFeed);
                    }
                }
            }
        };
    }

    // Option files open/close function
    openOptionFiles(index) {
        if (this.optionFilesVisible === index) {
            this.optionFilesVisible = null;
        } else {
            this.optionFilesVisible = index;
        }
    }

    /**
     * Close Option Files
     */
    closeOptionFiles(event): void {
        this.optionFilesVisible = null;
    }

    /**
     * Close box clicking outside
     * @param event
     */
    @HostListener('document:click', ['$event'])
    clickout(event) {
        if (!event.target.classList.contains('open-files-operation')) {
            this.optionFilesVisible = null;
        }
    }


    deleteFiles(type, file) {
        this.global.rightColumnValueFeed = file;
        this.global.itsOwnerDelete = type;
        this.global.deleteFile = true;
        this.global.optionsFiles = false;
    }

    /**
     * Show popup component
     * @param object
     */
    showPopupComponent(object: any) {
       this.global.commentSubsctiption = new BehaviorSubject('');
       this.global.showColumn(object.value, object.index, true );
       this.global.commentSubsctiption.next(true);
    }

    hideEditFile(event) {
        this.global.editFileVisible = true;
        this.global.postEditObject = event;
    }

    hideEditPost(event) {
        this.global.editPostVisible = true;
        this.global.postEditObject = event;
    }

    onEditLive(event) {
        this.global.liveSetupForm = true;
        this.global.liveEditObject = event;
    }

    showSecurity() {
        this.sectorService.securityModalStatus = true;
        // this.zindex.emit(110);
    }

    closeSecurity(status: boolean) {
        this.sectorService.securityModalStatus = !status;
        // this.zindex.emit(100);
    }

}
