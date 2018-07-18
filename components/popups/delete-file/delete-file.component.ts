import {Component, EventEmitter, Output} from '@angular/core';
import {GlobalService} from "../../../services/global.service";
import {FeedService} from "../../../services/feeds.service";
import {FolderService} from "../../../services/folder.service";
import {LiveService} from "../../../services/live.service";

@Component({
    selector: 'delete-file',
    templateUrl: 'delete-file.html'
})
export class DeleteFile {

    @Output() closeDeleteSection: EventEmitter<boolean> = new EventEmitter();

    constructor(
        public globalService: GlobalService,
        private feedService: FeedService,
        private folderService: FolderService,
        private liveService: LiveService,
    ) {}

    hidePopup() {
        this.globalService.deleteFile = false;
    }

    optionDelete() {
        const id = this.globalService.rightColumnValueFeed.id;
        const type = this.globalService.rightColumnValueFeed.type;
        this.closeDeleteSection.emit(false);
        this.globalService.deleteFile = false;
        this.globalService.filterAnimate();
        if(this.globalService.itsOwnerDelete == 'delete') {
            this.deleteFiles(id, type).then(() => {
                this.folderService.reloadPage();
                this.liveService.loadUpcoming();
                this.liveService.loadPast();
            });
        } else {
            this.unsubscribeFile(id).then(() => {
                this.folderService.reloadPage();
                this.liveService.loadUpcoming();
                this.liveService.loadPast();
            });
        }
    }

    private deleteFiles(...array) {
        return new Promise((resolve, reject) => {
            this.feedService.deleteFeed(array[0], array[1]).subscribe(
                (ok: Response) => {
                    resolve();
                },
                (error: any) => {
                    resolve();
            });
        });
    }

    private unsubscribeFile(id) {
        return new Promise((resolve, reject) => {
            this.globalService.postRquest(this.globalService.apiUrl+'files/unsubscribefile', {
                ids: [id]
            }).subscribe(
                successfully => {
                    resolve();
                },
                (error: any) => {
                    resolve();
            });
        });

    }
}