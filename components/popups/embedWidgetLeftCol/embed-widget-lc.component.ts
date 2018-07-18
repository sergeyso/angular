import {Component, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'embed-widget',
    templateUrl: 'embed-widget-lc.html'
})
export class EmbedWidgetLeftCol {

    //Pass this value in parent component
    @Output() openShowEmbedForm = new EventEmitter();

    //Hide popup here
    hidePopup() {
        this.openShowEmbedForm.emit(false);
    }
}