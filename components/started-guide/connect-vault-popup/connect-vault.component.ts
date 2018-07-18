import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'popup-connect-vault',
    templateUrl: 'connect-vault.html'
})
export class ConnectVaultComponent {
    @Output() closeModal = new EventEmitter<boolean>();
    constructor() {}

    hidePopup() {
        this.closeModal.emit(false);
        return false;
    }
}
