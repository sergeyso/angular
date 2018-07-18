import {Component} from '@angular/core';
import {GlobalService} from "../../services/global.service";
import {Router} from "@angular/router";
import {HeightScrollbar} from '../../models/class/popup/HeightScrollbar';

@Component({
    selector: 'popups',
    templateUrl: 'popups.html',
    styleUrls: ['popups.scss']
})
export class PopupComponent {
    fullSreenVar: boolean = false;
    constructor(
        public globalService: GlobalService,
        public router: Router
    ) {}

    onClick() {
        this.router.navigate([this.globalService.currentRoute]);
    }

    /**
     * Enable full screen
     */
    fullScreen() {
        this.fullSreenVar = !this.fullSreenVar;
    }

    /**
     * Height of the Perfect Scrollbar
     */
    popupHeightScrollbar(event: HeightScrollbar): void {
        this.globalService.popupHeight = this.calculateHeight(event);
    }

    /**
     * Clulculate
     * @return {number}
     */
    calculateHeight(event: HeightScrollbar) {
        return event.field - (event.content + event.user + 30)
    }
}