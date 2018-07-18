import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'popup-chrome-plugin',
    templateUrl: 'chrome-plugin.html'
})
export class ChromePluginComponent {
    @Output() closeModal = new EventEmitter<boolean>();
    constructor() {}

    hidePopup() {
        this.closeModal.emit(false);
        return false;
    }
}
