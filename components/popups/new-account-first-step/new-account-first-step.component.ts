import {Component, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'left-new-account-first-step',
    templateUrl: 'new-account-first-step.html'
})
export class LeftNewAccountFirstStep {
    logoName: string = 'logo.png';
    secondStepVisible: boolean = false;
    /** Create event emitter to emit click on parent component */
    @Output() closePopup : EventEmitter<boolean> = new EventEmitter();

    constructor( ) { }

    /**
     * Close popup and pass value to emitter
     */
    hidePopup():void {
        this.closePopup.emit(false);
    }

    /**
     * On upload take file name
     * @param event
     */
    onChangeFile(event) {
        this.logoName = event.target.files[0].name;
    }

    activateSecondStep() {
        this.secondStepVisible = true;
    }
}