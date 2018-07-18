import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'popup-setup-folders',
    templateUrl: 'setup-folders.html'
})
export class SetupFoldersComponent {
    @Output() closeModal = new EventEmitter<boolean>();
    constructor() {}

    hidePopup() {
        this.closeModal.emit(false);
        return false;
    }
}
