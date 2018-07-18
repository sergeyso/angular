import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'popup-add-process',
    templateUrl: 'add-process-popup.html'
})
export class AddProcessPopupComponent {
    @Output() close = new EventEmitter<boolean>();
    constructor() {}

    hidePopup() {
        this.close.emit(false);
        return false;
    }
}
