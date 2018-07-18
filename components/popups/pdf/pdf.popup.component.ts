import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import {GlobalService} from '../../../services/global.service';

@Component({
    selector: 'app-pdf-popups',
    templateUrl: 'pdf.popup.html',
    styleUrls: ['pdf.popup.scss']
})
export class PdfPopupComponent {
    @ViewChild('user_det') user_det: any;
    @ViewChild('content') content: any;
    @Output() height = new EventEmitter();

    file: any;
    preview: any;
    current_page: number = 0;

    constructor(
        public globalService: GlobalService,
        public sanitizer: DomSanitizer,
    ) {
        this.file = globalService.rightColumnValueFeed;

        this.preview = this.getPreviewImage(0);
    }

    /**
     *
     * @param index
     */
    choosePage(page: number): void {
        this.preview = this.getPreviewImage(page);
        this.current_page = page;
    }

    /**
     * Get first preview
     *
     * @param file
     * @returns {string}
     */
    getPreviewImage(index: number): string {
        if (this.file.filedata.encodings.length > 0) {
            if (this.file.filedata.encodings[0].data.length > 0) {
                return this.file.filedata.encodings[0].data[index].uri;
            }
        }

        return '';
    }
}