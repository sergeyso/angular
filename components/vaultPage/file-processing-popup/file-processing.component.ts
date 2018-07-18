import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'popup-file-processing',
    templateUrl: 'file-processing.html'
})
export class FileProcessingPopupComponent  {
    @Output() processingFilePopupStatus = new EventEmitter<boolean>();
    constructor () {}

    hidePopup () {
        this.processingFilePopupStatus.emit(false);
        return false;
    }
}