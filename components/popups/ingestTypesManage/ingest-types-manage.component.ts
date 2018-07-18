import {Component, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'ingest-type-manage',
    templateUrl: 'ingest-types-manage.html'
})
export class IngestTypesManage {
    //Pass this value in parent component
    @Output() openIngestType = new EventEmitter();

    hidePopup() {
        this.openIngestType.emit(false);
    }
}