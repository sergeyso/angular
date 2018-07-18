import {Component, AfterViewInit} from '@angular/core';
import {GlobalService} from "../../services/global.service";

@Component({
    selector: 'notifications-container',
    templateUrl: 'notifications.html'
})
export class NotificationComponent implements AfterViewInit {
    constructor(public global: GlobalService) {}

    ngAfterViewInit() {}
}