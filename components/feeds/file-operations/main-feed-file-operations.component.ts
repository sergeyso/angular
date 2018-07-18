import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {GlobalService} from "../../../services/global.service";


@Component({
    selector: 'main-feed-file-operation',
    templateUrl: 'main-feed-file-operations.html'
})
export class MainFeedFileOperationsComponent implements OnInit {

    @Input() value: any;
    @Input() index: any;
    key: number = 0;
    location: string;

    constructor(
        public global: GlobalService,
    ) {}

    ngOnInit() {
        this.location = `${this.value.filedata.exif_locality}, ${this.value.filedata.country.name}`;
    }
}