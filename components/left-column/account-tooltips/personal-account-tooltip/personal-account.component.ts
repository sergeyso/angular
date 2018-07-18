import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'popup-personal-account',
    templateUrl: 'personal-account.html'
})
export class PersonalAccountTooltipComponent {
    @Output() closeModal = new EventEmitter<boolean>();
    constructor(
    ) {}

    hidePopup() {
        this.closeModal.emit(false);
        return false;
    }
}
