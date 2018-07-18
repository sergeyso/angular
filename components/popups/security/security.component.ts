import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'security',
    templateUrl: 'security.html'
})
export class SecurityComponent {
    @Output() closeSecurityModal = new EventEmitter<boolean>();
    constructor() {}

    hidePopup() {
        this.closeSecurityModal.emit(true);
    }
}