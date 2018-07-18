import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'popup-create-post',
    templateUrl: 'create-post.html'
})
export class CreatePostComponent {
    @Output() closeModal = new EventEmitter<boolean>();
    constructor() {}

    hidePopup() {
        this.closeModal.emit(false);
        return false;
    }
}
