import {Component, Output, EventEmitter} from '@angular/core';
import {RecordVideoComponent} from '../../../components/popups/recordVideo/recordVideo.component';

@Component({
    selector: 'app-uploadform-add-record',
    templateUrl: 'upload-form-add-record.html'
})
export class UploadFormAddRecordComponent extends RecordVideoComponent {
    @Output() changePopup = new EventEmitter<any>();

    saveRecording() {
        const filename = 'video_' + this.randomNumber() + '.mp4';

        const file = new File([this.curr_video], filename, {
            type: 'video/mp4'
        });

        this.changePopup.emit(file);
    }
}
