import {Component, Input} from '@angular/core';
import {GlobalService} from '../../../services/global.service';
import {FeedService} from '../../../services/feeds.service';

@Component({
    selector: 'search-people',
    templateUrl: 'search-people.html'
})
export class SearchPeopleComponent {
    constructor(
        public globalService: GlobalService,
        public feedService: FeedService,
    ) {}
}