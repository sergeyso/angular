import {Component, AfterViewInit} from '@angular/core';
import {GlobalService} from "../../../../services/global.service";
import {ChannelService} from "../../../../services/channel.service";

@Component({
    selector: 'channels-preview',
    templateUrl: 'channels-preview.html'
})
export class ChannelsPreview implements AfterViewInit{
    subscribeVar:any;
    constructor(
        public global: GlobalService,
        public channelService: ChannelService,
    ) {}

    ngAfterViewInit() {
        this.subscribeSelect();
    }

    /* Hide channel popup*/
    hidePopup() {
        this.global.channelPreviewPopup = false;
        this.channelService.channelSelected = null;
    }

    /*Subscribe options Select2*/
    private subscribeSelect() {
        this.subscribeVar = $('#subscribe_option').select2({
            containerCssClass: "subscribe-header",
            dropdownCssClass: "white-orange",
            minimumResultsForSearch: Infinity
        });
    };
}