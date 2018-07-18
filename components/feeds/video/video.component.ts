import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GlobalService} from "../../../services/global.service";

@Component({
    selector: 'video-component',
    templateUrl: 'video.html'
})
export class VideoComponent {

    @Input() value: any;
    @Input() index: any;
    @Output() showPopupComponent = new EventEmitter();

    constructor(
        public global: GlobalService,
    ) {}

    /**
     * Show comments
     * @param value
     * @param index
     */
    showComments(value, index) {
        this.showPopupComponent.emit(
            {
                value: value,
                index: index
            }
        );
    }

    getVideoLink(file: any): string {
        if (file.filedata.encodings.length > 0) {
            return file.filedata.encodings[file.filedata.encodings.length - 1].uri;
        }

        return file.filedata.link;
    }
}