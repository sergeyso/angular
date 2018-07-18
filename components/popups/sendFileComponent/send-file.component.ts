import {Component} from '@angular/core';
import {GlobalService} from "../../../services/global.service";
import {SendFile} from "../../../models/class/sendFile/SendFile";
import {ValidationForm} from "../../../helpers/validation";
import {UploadService} from "../../../services/uploadFile.service";


@Component({
    selector: 'send-file',
    templateUrl: 'send-file.html'
})
export class SendFileComponent {
    fileNameRecepient: string = 'Pick a file to upload';
    errorFile: string = '';
    errorMessage: string = '';
    sendFileObject: SendFile = new SendFile(this.globalService.currentUser.id);
    responseMessage: string = '';
    loading: boolean = false;
    constructor(
        public globalService: GlobalService,
        public uploadService: UploadService
    ) {
        this.uploadService.progress$.subscribe((data: number) => {});
    }
    hidePopup() {
        this.globalService.sendFilePopupVisible = false;
    }

    onChangeFile(event) {
        if(ValidationForm.file(event.target)) {
            this.errorFile = '';
            this.sendFileObject.file_content = event.target.files[0];
            this.fileNameRecepient = event.target.files[0].name;
            return;
        }

        this.errorFile = 'File is not valid. Please make sure that file extension is (png, jpg, jpeg, mp4, flv, mov, avi, docx, xlsx, pptx, doc, xls, ppt)'
        setTimeout(() => {
            this.errorFile = '';
        }, 5000);
    }

    sendFile() {
        this.errorFile = this.sendFileObject.file_content ? '' : 'File is required';
        this.errorMessage = this.sendFileObject.message ? '' : 'Message is required';

        if(!this.errorFile && !this.errorMessage && !this.loading) {
            this.loading = true;
            this.uploadService.upload(this.sendFileObject, `${this.globalService.apiUrl}files/send`).subscribe(
                (uploads: Response) => {
                    this.responseMessage = 'Thanks.  Your file has been sent.'
                }, (err: any) => {
                    this.responseMessage = 'There is some error about upload file. Please try again'
                }, () => {
                    this.loading = false;
                    setTimeout(() => {
                        this.responseMessage = '';
                        this.sendFileObject = new SendFile(this.globalService.currentUser.id);
                        this.fileNameRecepient = 'Pick a file to upload';
                    }, 5000);
                });
        }

        setTimeout(() => {
            this.errorFile = '';
            this.errorMessage = '';
        }, 5000);
    }
}