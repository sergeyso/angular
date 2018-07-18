import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {GlobalService} from '../../../services/global.service';
import {HeightScrollbar} from '../../../models/class/popup/HeightScrollbar';

@Component({
    selector: 'app-video-popups',
    templateUrl: 'video.popup.html',
    styleUrls: ['video.popup.scss']
})
export class VideoPopupComponent {

    @ViewChild('videoChild') videoChild: any;
    @ViewChild('user_det') user_det: any;
    @ViewChild('content') content: any;
    @Output() height = new EventEmitter();

    constructor(
        public globalService: GlobalService
    ) {}


    onLoadVideo(): void {
        this.height.emit(
            new HeightScrollbar(
                this.videoChild.nativeElement.offsetHeight,
                this.user_det.nativeElement.offsetHeight,
                this.content.nativeElement.offsetHeight
            )
        );
    }
}