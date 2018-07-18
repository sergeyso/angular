import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'popup-upload-content',
    templateUrl: 'upload-content.html'
})
export class UploadContentComponent {
    @Output() closeModal = new EventEmitter<boolean>();
    constructor() {}

    hidePopup() {
        this.closeModal.emit(false);
        return false;
    }
}
