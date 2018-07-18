import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'choose-pdf-image',
    templateUrl: 'pdf-choose-image.html'
})
export class ChoosePdfImage {
    participantForm: boolean = false;
    presentersForm: boolean = false;
    reminderEmails: boolean = false;
    showLiveButton: boolean = true;
    PictureName: string = '';

    //Create event emitter to emit click on parent component
    @Output() closePopup : EventEmitter<boolean> = new EventEmitter();

    //Close popup and pass value to emitter
    hidePopup():void {
        this.closePopup.emit(false);
    }

    onChangeFile(event) {
        this.PictureName = event.target.files[0].name;
    }
}