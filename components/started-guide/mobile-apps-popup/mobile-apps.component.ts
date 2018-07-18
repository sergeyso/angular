import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'popup-mobile-apps',
    templateUrl: 'mobile-apps.html'
})
export class MobileAppsComponent {
    @Output() closeModal = new EventEmitter<boolean>();
    constructor() {}

    hidePopup() {
        this.closeModal.emit(false);
        return false;
    }
}
