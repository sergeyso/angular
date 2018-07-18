import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {GlobalService} from '../../../services/global.service';
import {FolderService} from '../../../services/folder.service';
import {ResponseApi} from '../../../models/interfaces/responseApi.interface';
import {ValidationForm} from '../../../helpers/validation';

@Component({
    selector: 'main-answer',
    templateUrl: 'answer.html'
})
export class AnswerComponent {
    answer: string = '';
    mainPage: boolean = this.globalService.url === '';
    loadingAnswerRequest: boolean = false;
    @ViewChild('answerForm') answerForm: NgForm;
    @Output() closePopup = new EventEmitter();

    /**
     * @param {GlobalService} globalService
     * @param {FolderService} folderService
     */
    constructor(
        public globalService: GlobalService,
        public folderService: FolderService
    ) {}

    /**
     * Submit the form
     */
    answerSubmit(form): void {
        ValidationForm.checkValid(form);
        if (this.answerForm.valid) {
            this.loadingAnswerRequest = true;
            this.callRequestAnswer();
        }
    }

    /**
     * Call Http Request
     */
    private callRequestAnswer() {
        this.globalService.postRquest(`${this.globalService.apiUrl}questions/answer/${this.globalService.question.id}`, {
            text: this.answer
        }).subscribe(
            (isSucess: ResponseApi) => {
                this.globalService.question.answers.push(isSucess.response_data);
            }, error2 => {
                this.loadingAnswerRequest = false;
                console.error(error2);
            }, () => {
                if (this.mainPage) {
                    this.folderService.reloadPage();
                    this.closePopup.emit(false);
                }
                this.answer = '';
                this.loadingAnswerRequest = false;
                this.answerForm.reset();
            }
        );
    }


    /**
     * Event Emiter Close Popup
     */
    closeSection() {
        this.closePopup.emit(false);
    }
}
