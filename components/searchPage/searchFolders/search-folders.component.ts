import {Component, Input} from '@angular/core';
import {GlobalService} from '../../../services/global.service';
import {FeedService} from '../../../services/feeds.service';

@Component({
    selector: 'search-folders',
    templateUrl: 'search-folders.html'
})
export class SearchFoldersComponent {
    constructor(
        public globalService: GlobalService,
        public feedService: FeedService,
    ) {}
}