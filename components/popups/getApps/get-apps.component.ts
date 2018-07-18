import {Component, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'get_apps',
    templateUrl: 'get-apps.html'
})
export class GetAppsComponent {
    //Pass this value in parent component
    @Output() openGetAppsForm = new EventEmitter();

    //Hide popup here
    hidePopup() {
        this.openGetAppsForm.emit(false);
    }
}