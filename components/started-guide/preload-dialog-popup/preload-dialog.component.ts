import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SectorService} from "../../../services/sector.service";
import {ChannelService} from "../../../services/channel.service";
import {Response} from '@angular/http';
import {GlobalService} from "../../../services/global.service";

@Component({
    selector: 'popup-preload-dialog',
    templateUrl: 'preload-dialog.html'
})
export class PreloadDialogComponent {
    @Output() closeModal = new EventEmitter<boolean>();
    @Output() skipStatus = new EventEmitter<boolean>();
    @Input() sectorIndex: number;
    loading: boolean = false;

    constructor(
        private sectorService: SectorService,
        private channelService: ChannelService,
        private globalService: GlobalService
    ) {
    }

    hidePopup() {
        this.loading = false;
        this.closeModal.emit(false);
        return false;
    }

    skip() {
        this.sectorService.closeStartedGuide().subscribe(
            () => {
                this.globalService.login.data.start_guide = false;
            });
        this.hidePopup();
        this.skipStatus.emit(true);
        return false;
    }

    apply() {
        this.loading = true;
        if (this.sectorService.sectors[this.sectorIndex].channels === false) {
            this.skip();
            return false;
        }
        this.sectorService.createChannels(this.sectorIndex).subscribe(
            (response: Response) => {
                this.channelService.channels.push(...response.json().response_data);
                this.sectorService.closeStartedGuide().subscribe(
                    () => {
                        this.sectorService.readTips([], this.sectorService.sectors[this.sectorIndex].name);
                        this.globalService.login.data.start_guide = false;
                    });
                this.hidePopup();
            }
        );
        return false;

    }
}
