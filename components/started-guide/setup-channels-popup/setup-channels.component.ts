import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'popup-setup-channels',
    templateUrl: 'setup-channels.html'
})
export class SetupChannelsComponent {
    @Output() closeModal = new EventEmitter<boolean>();
    constructor() {}

    hidePopup() {
        this.closeModal.emit(false);
        return false;
    }
}
