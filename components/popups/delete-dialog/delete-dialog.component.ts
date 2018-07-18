import {Component, EventEmitter, Output, Input} from '@angular/core';

@Component({
    selector: 'delete-dialog',
    templateUrl: 'delete-dialog.html'
})
export class DeleteDialogComponent {
    @Output() closeDeleteDialog = new EventEmitter<boolean>();
    @Output() okCallBack = new EventEmitter<boolean>();
    @Input() deleteText: string = '';
    constructor() {}

    clickDelete() {
        this.okCallBack.emit(true);
        this.hidePopup();
    }

    hidePopup() {
        this.closeDeleteDialog.emit(false);
    }

}