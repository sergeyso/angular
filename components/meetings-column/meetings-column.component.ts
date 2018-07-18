import {Component, Output, EventEmitter, ViewChild} from '@angular/core';
import {GlobalService} from '../../services/global.service';
import {LiveService} from '../../services/live.service';
import {FeedService} from "../../services/feeds.service";
import {FolderService} from '../../services/folder.service';
import {SectorService} from "../../services/sector.service";

@Component({
    selector: 'meetings-column',
    templateUrl: 'meetings-column.html',
})
export class MeetingsColumnComponent {
    @ViewChild('mainBox') mainBox: ViewChild;
    optionEventVisible: number = null;
    
    constructor(
        public globalService: GlobalService,
        public liveService: LiveService,
        public feedServices: FeedService,
        public folderService: FolderService,
        public sectorService: SectorService
    ) {
        this.liveService.loadUpcoming();
        this.liveService.loadPast();
    }
    
    openLiveSetupFormLeft() {
        this.globalService.liveSetupForm = true;
        return false;
    }
    
    onAutoLoadUpcomingEvents(event) {
        this.liveService.loadNextUpcoming();
    }
    
    onOpenOptionEvent(index) {
        if (this.optionEventVisible === index) {
            this.optionEventVisible = null;
        } else {
            this.optionEventVisible = index;
        }
    }
    
    onCloseOptionFiles(event): void {
        this.optionEventVisible = null;
    }

    onFeedFilterPassed(): void {
        this.folderService.filterFeedsLiveFilter({
            isUpcoming: false,
            isPassed: true,
            isLive: false,
            isOther: false,
        });
    }
    
    onEditLive(file) {
        this.globalService.liveSetupForm = true;
        this.globalService.liveEditObject = file;
    }

    onDeleteLive(file) {
        this.globalService.rightColumnValueFeed = file;
        this.globalService.itsOwnerDelete = 'delete';
        this.globalService.deleteFile = true;
        this.globalService.optionsFiles = false;
    }
}