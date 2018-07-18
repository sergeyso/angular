import {Component, Output, EventEmitter, ViewChild} from '@angular/core';
import {Question} from '../../../models/class/question/Question';
import {ValidationForm} from '../../../helpers/validation';
import {NgForm} from '@angular/forms';
import {GlobalService} from '../../../services/global.service';
import {UploadService} from '../../../services/uploadFile.service';
import {ChannelService} from '../../../services/channel.service';
import {FolderService} from '../../../services/folder.service';

@Component({
    selector: 'ask-question',
    templateUrl: 'ask-question.html'
})
export class AskQuestionComponent {
    showSelectedContact: number = 2;
    uploadedImage: string = '';
    selectChannelForm: boolean = false;
    selectWhoToAskForm: boolean = false;
    questionModel: Question = new Question();
    selectedChannel: number;
    selectedChannelObject: any;
    searchChannel: boolean = true;
    searchContat: boolean = true;
    channelName: string = '';
    searchChannelsInput: string = '';
    searchContactInput: string = '';
    selectContacts: Array<any> = [];
    selectedContacts: Array<any> = [];
    loading: boolean = false;
    submited: boolean = false;
    submitQuestionForm: boolean = false;
    message: string = '';
    emails: string = '';

    /** Create event emitter to emit click on parent component */
    @Output() closePopup: EventEmitter<boolean> = new EventEmitter();
    @ViewChild('questionFile') questionFile: any;
    @ViewChild('questionForm') questionForm: NgForm;

    constructor(
        public globalService: GlobalService,
        public uploadService: UploadService,
        public channelService: ChannelService,
        public folderService: FolderService,
    ) {
        this.uploadService.progress$.subscribe((data: number) => {});
    }

    /**
     * Close popup and pass value to emitter
     */
    hidePopup(): void {
        this.closePopup.emit(false);
    }

    /**
     * Take input name
     * @param event
     */
    onChangeFile(event): void {
        this.uploadedImage = event.target.files[0].name;
        this.questionModel.attachFiles = event.target.files[0];
    }

    /**
     * Remove Seleced Image
     */
    removeSelectedImage(): void {
        this.questionFile.nativeElement.value = '';
        this.uploadedImage = '';
        this.questionModel.attachFiles = null;
    }

    /**
     * Open select channel form
     */
    selectChannel(): void {
        this.selectedChannel = this.questionFile.channel_id;
        this.selectWhoToAskForm = false;
        this.selectChannelForm = !this.selectChannelForm;
    }

    /**
     * Open select channel form
     */
    selectWhoToAsk(): void {
        this.selectContacts = this.selectedContacts.slice();
        this.selectWhoToAskForm = !this.selectWhoToAskForm;
        this.selectChannelForm = false;
    }

    /**
     * Close pop up for channels and users
     * @param event
     */
    closePopUpButton(event): void {
        if (!event.target.classList.contains('live-stream-bottom-part-single-title')) {
            this.selectChannelForm = false;
            this.selectWhoToAskForm = false
        }
    }

    /**
     * Select Channel to model
     * @param channel
     */
    inviteChannel(channel): void {
        this.questionModel.channel_id = channel.id;
        this.selectChannelForm = false;
        this.channelName = channel.name;
    }

    /**
     * Select Contacts to model
     */
    inviteContacts(): void {
        this.selectedContacts = this.selectContacts.slice();
        this.selectWhoToAskForm = false;
        this.questionModel.syncUserEmails = this.emails.split(',').filter(value => {
            if (ValidationForm.email(value)) {
                return value;
            }
        }).map(value => {
            return value.trim()
        });
    }

    /**
     * Select contact to array
     * @param event
     * @param object
     */
    selectContactsArray(event, object): void {
        if (event) {
            this.selectContacts.push(object);
        } else {
            const index = this.selectContacts.indexOf(object);
            this.selectContacts.splice(index, 1);
        }
    }

    /**
     * Select Channel to input
     * @param event
     * @param object
     */
    changeChannels(event, object): void {
        if (event) {
            this.selectedChannel = object.id;
            this.selectedChannelObject = object;
        } else {
            this.selectedChannel = null;
            this.selectedChannelObject = null;
        }
    }

    /**
     * Show selected count -2
     * @return {number}
     */
    showCountSelectedContact(): number {
        return this.selectedContacts.length - 2;
    }

    /**
     * Submit form
     */
    questionSubmit(): void {
        try {
            this.submitQuestionForm = true;
            ValidationForm.checkValid(this.questionForm);
            if (this.questionForm.valid) {
                this.loading = true;
                this.submited = true;
                this.questionModel.syncUsersIds = this.selectedContacts.map(value => {
                    return value.contact_user.id;
                });
                this.callRequest();
            }
        } catch (e) {
            document.location.href = '/settings';
        }
    }

    /**
     * Make post request to API
     */
    callRequest(): void {
        /* hardcoded empty channel and user*/
        this.questionModel.syncUsersIds = JSON.stringify(this.questionModel.syncUsersIds);
        this.questionModel.syncUserEmails = JSON.stringify(this.questionModel.syncUserEmails);
        this.uploadService.upload(this.questionModel, this.globalService.apiUrl + 'questions').subscribe(
            (uploads: Response) => {
                this.folderService.reloadPage();
            },
            (err: any) => {
                this.loading = false;
                this.submited = false;
                this.message = 'There is some problem now, Please try later';
                setTimeout(() => {
                    this.message = '';
                }, 4000);
            },
            () => {
                this.loading = false;
                this.hidePopup();
            });
    }

    /*/!**
     * Select 2 ask questions by email
     *!/
    private emailSelect(): void {
        this.select2Emails = $('#emailsSelect2').select2({
            placeholder: 'Add emails of non-users (comma separated)',
            allowClear: true,
            tags: true,
            tokenSeparators: [',', ' '],
            containerCssClass: 'white-orange',
            dropdownCssClass: 'white-orange'
        });
    }*/
}
