import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GlobalService} from "../../../services/global.service";


@Component({
    selector: 'pdf-component',
    templateUrl: 'pdf.html'
})
export class PdfComponent {
    showChooseImage: boolean = false;
    @Input() value: any;
    @Input() index: any;
    @Output() showPopupComponent = new EventEmitter();

    constructor(
        public global: GlobalService,
    ) {}

    // Open choose image popup
    openChooseImage() {
        this.showChooseImage = true;
    }

    // Close choose image popup true event emitter
    closeChoosePdf() {
        this.showChooseImage = false;
    }

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

    getExtension(name: string): string {
        return name.split('.').pop().toLowerCase();
    }
}