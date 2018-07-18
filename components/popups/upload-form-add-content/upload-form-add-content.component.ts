import {Component, Output, EventEmitter} from '@angular/core';
import {SubscribeFiles} from '../../../models/class/post/SubscribeFiles';
import {FileUploader} from "ng2-file-upload";

@Component({
    selector: 'uploadform-add-content',
    templateUrl: 'upload-form-add-content.html'
})
export class UploadFormAddContent {
    selectedTab: number = 2;
    errorMessage: string = '';
    addContentPopup: boolean = false;
    // Create event emitter to emit click on parent component
    @Output() closePopup: EventEmitter<SubscribeFiles> = new EventEmitter();
    files: Array<any> = [];
    emit: SubscribeFiles = new SubscribeFiles();
    @Output() zindex = new EventEmitter();
    uploader: FileUploader = new FileUploader({autoUpload: false});
    hasBaseDropZoneOver: boolean = false;

    /**
     * Close popup and pass value to emitter
     */
    hidePopup(): void {
        this.closePopup.emit(this.emit);
    }

    fileOverBase (e:any):void {
        this.hasBaseDropZoneOver = e;
    }

    /**
     * Send Files To Object
     */
    sendFiles() {
        this.emit.submit = true;
        this.emit.files = this.files;
        this.closePopup.emit(this.emit);
    }

    /**
     * Send Files To Object
     */
    onAddedVideoFile(file: any) {
        this.files.push(file);
        this.selectedTab = 2;
    }

    /**
     * On change input
     * @param event
     *
     * @return {void}
     */
    onChangeMultipleFile(event) {
        this.addDataToObject(event.target.files);
        event.srcElement.value = '';
    }

    /**
     * Add files to Array
     * @param files
     */
    addDataToObject(files) {
        for (let i = 0, f; f = files[i]; i++) {
            if (this.file(f)) {
                this.files.push(f);
            } else {
                this.errorMessage = 'File with that extension it\'s not supported at the moment';
                setTimeout(() => { this.errorMessage = ''; }, 5000);
            }
        }
    }

    private file(btn) {
        const ext = btn.name.split('.').pop().toLowerCase();
        return $.inArray(ext,
            [
                'png',
                'jpg',
                'jpeg',
                'mp4',
                'webm',
                'flv',
                'mov',
                'avi',
                'docx',
                'xlsx',
                'pptx',
                'doc',
                'xls',
                'ppt',
                'pdf',
                'gif'
            ]
        ) > -1;
    }

    /**
     * Remove Selected File
     * @param index
     */
    removeSelectedFile(index) {
        this.files.splice(index, 1)
    }
}
