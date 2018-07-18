import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'popup-invite-contacts',
    templateUrl: 'invite-contacts.html'
})
export class InviteContactsComponent {
    @Output() closeModal = new EventEmitter<boolean>();
    constructor() {}

    hidePopup() {
        this.closeModal.emit(false);
        return false;
    }
}
