import {Component} from '@angular/core';
import {GlobalService} from '../../../services/global.service';
import {FeedService} from '../../../services/feeds.service';

@Component({
    selector: 'search-files',
    templateUrl: 'search-files.html'
})
export class SearchFilesComponent {
    constructor(
        public globalService: GlobalService,
        public feedService: FeedService,
    ) {}
}