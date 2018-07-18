import {Component} from '@angular/core';
import {GlobalService} from "../../services/global.service";

@Component({
    selector: 'app',
    templateUrl: 'channels.html'
})
export class ChannelsPage {
    constructor(
        public global: GlobalService
    ) {}

    openChannel() {
        this.global.channelPreviewPopup = true;
    }


}