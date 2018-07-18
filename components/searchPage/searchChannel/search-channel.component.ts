import {Component, Input} from '@angular/core';
import {GlobalService} from '../../../services/global.service';
import {FeedService} from '../../../services/feeds.service';

@Component({
    selector: 'search-channels',
    templateUrl: 'search-channel.html'
})
export class SearchChannelsComponent {
    constructor(
        public globalService: GlobalService,
        public feedService: FeedService,
    ) {}
}