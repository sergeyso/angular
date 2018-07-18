import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'popup-ask-question',
    templateUrl: 'ask-question.html'
})
export class AskQuestionComponent {
    @Output() closeModal = new EventEmitter<boolean>();
    constructor() {}

    hidePopup() {
        this.closeModal.emit(false);
        return false;
    }

}
