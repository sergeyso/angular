import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {GlobalService} from '../../../services/global.service';
import {HeightScrollbar} from '../../../models/class/popup/HeightScrollbar';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-image-popups',
    templateUrl: 'image.popup.html',
    styleUrls: ['image.popup.scss']
})
export class ImagePopupComponent {
    @ViewChild('imageChild') imageChild: any;
    @ViewChild('user_det') user_det: any;
    @ViewChild('content') content: any;
    @Output() height = new EventEmitter();

    constructor(
        public globalService: GlobalService
    ) {}

    /**
     * Event Emitter for height
     */
    onLoadImage(): void {
        this.height.emit(
            new HeightScrollbar (
                this.imageChild.nativeElement.offsetHeight,
                this.user_det.nativeElement.offsetHeight,
                this.content.nativeElement.offsetHeight
            )
        );
    }
}
