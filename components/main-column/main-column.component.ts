import {Component, AfterViewInit} from '@angular/core';
import {GlobalService} from "../../services/global.service";
import {FolderService} from "../../services/folder.service";
import {FeedService} from "../../services/feeds.service";
import {SectorService} from "../../services/sector.service";
import {ChannelService} from "../../services/channel.service";

@Component({
    selector: 'app',
    templateUrl: 'main-column.html'
})
export class MainColumn {
    constructor(
        public global: GlobalService,
        public folderService: FolderService,
        public feedServices: FeedService,
        public sectorService: SectorService,
        public channelService: ChannelService
    ) {}

    onResize(event) {

    }
}