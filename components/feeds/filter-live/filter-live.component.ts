import {Component, Input, OnChanges} from '@angular/core';
import {GlobalService} from '../../../services/global.service';

@Component({
    selector: 'filter-live',
    templateUrl: 'filter-live.html',
    styleUrls: [
        'filter-live.css'
    ],
})
export class FilterLiveComponent implements OnChanges {
    @Input() isLive: boolean = true;
    @Input() isUpcoming: boolean = true;
    @Input() isPassed: boolean = true;
    @Input() isOther: boolean = true;
    @Input() items: any;

    ngOnChanges() {
        this.items.forEach(this.filterItems.bind(this));
    }

    onChange(event) {
        this.items.forEach(this.filterItems.bind(this));
    }

    private filterItems(item) {
        let isUpcoming = item.filedata.live.isUpcoming === this.isUpcoming && this.isUpcoming;
        let isPassed = item.filedata.live.isPassed === this.isPassed && this.isPassed;
        let isLive = item.filedata.live.isLive === this.isLive && this.isLive;
        let isOther = !item.filedata.live.isUpcoming && !item.filedata.live.isPassed && !item.filedata.live.isLive && this.isOther;
        item.hidden = !(isUpcoming || isPassed || isLive || isOther);
    }
}