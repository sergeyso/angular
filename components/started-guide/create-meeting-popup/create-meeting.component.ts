import {Component, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'popup-create-meeting',
    templateUrl: 'create-meeting.html'
})
export class CreateMeetingComponent {
    @Output() closeModal = new EventEmitter<boolean>();
    constructor() {}

    hidePopup() {
        this.closeModal.emit(false);
        return false;
    }
}
