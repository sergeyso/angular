import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {GlobalService} from "../../../services/global.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {HeightScrollbar} from '../../../models/class/popup/HeightScrollbar';

@Component({
    selector: 'app-document-popups',
    templateUrl: 'document.popup.html',
    styleUrls: ['document.popup.scss']
})
export class DocumentPopupComponent{
    @ViewChild('iframe') slider: any;
    @ViewChild('user_det') user_det: any;
    @ViewChild('content') content: any;
    @Output() height = new EventEmitter();
    url: any;

    constructor(
        public globalService: GlobalService,
        private sanitizer: DomSanitizer,
    ) {
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://view.officeapps.live.com/op/view.aspx?src=${globalService.rightColumnValueFeed.filedata.link}`
        );
    }

    onLoadIframe() {
        this.height.emit(
            new HeightScrollbar(
                this.slider.nativeElement.offsetHeight,
                this.user_det.nativeElement.offsetHeight,
                this.content.nativeElement.offsetHeight
            )
        );
    }
}