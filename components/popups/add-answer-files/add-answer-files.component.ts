import {Component, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'main-add-answer-files',
    templateUrl: 'add-answer-files.html'
})
export class AddAnswerFilesComponent {
    selectedTab: number = 1;
    // Create event emitter to emit click on parent component
    @Output() closePopup: EventEmitter<boolean> = new EventEmitter();

    // Close popup and pass value to emitter
    hidePopup(): void {
        this.closePopup.emit(false);
    }
}
