import {AfterViewInit, OnInit, Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {GlobalService} from "../../../services/global.service";
import {UploadService} from '../../../services/uploadFile.service';
import {FolderService} from '../../../services/folder.service';
import {FeedService} from '../../../services/feeds.service';
import {ChannelService} from '../../../services/channel.service';
import {LiveService} from '../../../services/live.service';
import {Observable} from 'rxjs/Observable';
import {ValidationForm} from '../../../helpers/validation';
import {NgForm} from '@angular/forms';
import * as moment from 'moment';

@Component({
    selector: 'live-setup',
    templateUrl: 'live-setup.html'
})
export class LiveSetupComponent implements OnInit {

    @ViewChild('liveForm') liveForm: NgForm;
    
    public dateTimePickerOptions: any = {
        dateFormat: "M j, H:i"
    };

    // Create event emitter to emit click on parent component
    @Output() closePopup: EventEmitter<boolean> = new EventEmitter();
    choosenDateFormatted: string = 'Now';
    title: string = '';
    private _choosenDate: Date = null;
    limitParticipants: number = 6;
    participants: Array<any> = [];
    invites: Array<any> = [];
    users: Array<any> = [];
    channels: Array<any> = [];
    selected: number = 1;
    participantForm: boolean = false;
    channelsForm: boolean = false;
    reminderEmails: boolean = false;
    showLiveButton: boolean = true;
    stepOneVisible: boolean = true;
    uploadedLive = null;
    liveUrl: string = '';
    liveStartAt: number = null;
    liveStartAtFormat: string = 'MMMM Do YYYY, HH:mm';
    liveStartAtFormatted: string = null;
    channelFilterName: string;
    checkAllChannels: boolean = false;
    userFilterName: string;
    newInviteUser: any;
    processing: boolean = false;
    serverErrorMessage: string = '';

    constructor(
        public globalService: GlobalService,
        public uploadService: UploadService,
        public folderService: FolderService,
        public feedService: FeedService,
        public channelService: ChannelService,
        public liveService: LiveService,
    ) {
        this.uploadProcess();
    }

    ngOnInit() {
        this.initLiveEditObject();
    }

    // Close popup and pass value to emitter
    hidePopup(): void {
        this.closePopup.emit(false);
    }

    // Open Participant form
    OpenParticipant() {
        this.participantForm = !this.participantForm;
        this.channelsForm = false;
        this.reminderEmails = false;

        if (!this.users.length) {
            this.globalService.contacts.forEach((contact) => {
                this.users.push(contact.contact_user);
            });
        }
    }

    SaveParticipants() {
        this.participantForm = false;
    }

    onAddToParticipants(event, user) {
        if (event.target.checked) {
            if ((this.participants.length + this.invites.length) >= this.limitParticipants) {
                alert('Knowlocker supports up to ' + this.limitParticipants + ' people in a room.');
                event.target.checked = false;
                return;
            }
            this.participants.push(user);
        } else {
            this.participants = this.participants.filter((participant) => {
                return !(participant.id === user.id);
            });
        }
    }
    onAddToInvites(event, invite) {
        if (!(typeof invite.isInvite !== 'undefined' && invite.isInvite)) {
            return;
        }
        if (event.target.checked) {
            if ((this.participants.length + this.invites.length) >= this.limitParticipants) {
                alert('Knowlocker supports up to ' + this.limitParticipants + ' people in a room.');
                event.target.checked = false;
                return;
            }
            if (!this.hasInvite(invite)) {
                this.invites.push(invite);
                this.newInviteUser = null;
            }
        } else {
            this.invites = this.invites.filter((i) => {
                return !(i.email === invite.email);
            });
            this.newInviteUser = this.createInviteUser(this.userFilterName);
        }
    }

    // Open Participant form
    OpenChannels() {
        this.channelsForm = !this.channelsForm;
        this.participantForm = false;
        this.reminderEmails = false;
    }

    onCheckChannels(event, channel) {
        if (event.target.checked) {
            this.channels.push(channel);
        } else {
            this.channels = this.channels.filter((c) => {
                return !(c.id === channel.id);
            });
        }
    }

    // // Open Setup Reminder Emails
    // openReminderEmails() {
    //     this.reminderEmails = !this.reminderEmails;
    //     this.channelsForm = false;
    //     this.participantForm = false;
    // }

    onDateTimeChanged(event) {
        this.choosenDate = event.selectedDates[0];
    };

    onDateTimeBeforeInit(config) {
        var now = new Date();
        var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var file = this.globalService.liveEditObject;
        var begin = new Date;
        if (file) {
            begin = moment.utc(file.filedata.live.begin_at * 1000).toDate();
        }
        config.selectedDates = [begin];
        config.enable = [(function (date) {
            var isSelected = false;
            for (var i = 0; i < config.selectedDates.length; i++) {
                var selectedDate = config.selectedDates[i];
                isSelected = date.getFullYear() === selectedDate.getFullYear() && date.getMonth() === selectedDate.getMonth() && date.getDate() === selectedDate.getDate();
                if (isSelected) {
                    return isSelected;
                }
            }
            return date.getTime() >= today.getTime();
        })];
    }

    get choosenDate(): Date {
        return this._choosenDate;
    }

    set choosenDate(date: Date) {
        this._choosenDate = date;
        this.choosenDateFormatted = moment.utc(this.choosenDate).format('MMM D, HH:mm') + ' UTC';
        this.showLiveButton = false;
    }

    /**
     * Close pop up for channels and users
     * @param event
     */
    closePopUpButton(event): void {
        if (!event.target.classList.contains('open-second-popup')) {
            this.participantForm = false;
            this.channelsForm = false;
            this.reminderEmails = false;
        }
    }

    /**
     * Show step two from live setup form
     */
    showStepTwo() {
        try {
            ValidationForm.checkValid(this.liveForm);
            if(!this.liveForm.valid){
                return ;
            }
        } catch (e) {
            this.serverErrorMessage = e.message;
            return ;
        }
        
        this.processing = true;
        this.serverErrorMessage = '';
        var data = {
            name: this.title,
            file_content: this.createLiveFile(),
            access: this.createAccess(),
            channel_id: this.createChannels(),
        };

        this.uploadService.upload(data, this.uploadUrl).subscribe(
            (uploads: Response) => {
                try {
                    this.uploadedLive = uploads.response_data[0];
                    this.inviteNewContacts(this.uploadedLive.id).subscribe((invites: Response) => {
                    }, (err: any) => {
                        console.error(err);
                        this.parseServerError(err);
                        this.globalService.liveEditObject = this.uploadedLive;
                    }, () => {
                        this.liveUrl = window['app'] + '/live/' + this.uploadedLive.id;
                        this.liveStartAt = this.uploadedLive.filedata.live.begin_at;
                        this.liveStartAtFormatted = moment.utc(this.liveStartAt * 1000).format(this.liveStartAtFormat);

                        this.stepOneVisible = false;
                        this.feedService.refreshPage = true;
                        this.folderService.select('root', '', 'root', '');
                        this.liveService.loadUpcoming();
                        this.processing = false;
                    });
                } catch (error) {
                    alert(error.message);
                    this.processing = false;
                }
            },
            (err: any) => {
                console.error(err);
                this.parseServerError(err);
                this.processing = false;
            }
        );
    }

    startLiveNow() {
        try {
            ValidationForm.checkValid(this.liveForm);
            if(!this.liveForm.valid){
                return ;
            }
        } catch (e) {
            this.serverErrorMessage = e.message;
            return ;
        }
        
        this.processing = true;
        this.serverErrorMessage = '';
    
        var data = {
            name: this.title,
            file_content: this.createLiveFile(),
            access: this.createAccess(),
            channel_id: this.createChannels(),
        };

        this.uploadService.upload(data, this.uploadUrl).subscribe(
            (uploads: Response) => {
                try {
                    this.uploadedLive = uploads.response_data[0];
                    this.inviteNewContacts(this.uploadedLive.id).subscribe((invites: Response) => {
                    }, (err: any) => {
                        console.error(err);
                        this.parseServerError(err);
                        this.globalService.liveEditObject = this.uploadedLive;
                    }, () => {
                        this.liveUrl = window['app'] + '/live/' + this.uploadedLive.id;
                        this.liveStartAt = this.uploadedLive.filedata.live.begin_at;
                        this.liveStartAtFormatted = moment.utc(this.liveStartAt * 1000).format(this.liveStartAtFormat);

                        this.processing = false;
                        window.location.href = this.liveUrl;
                    });
                } catch (error) {
                    alert(error.message);
                    this.processing = false;
                }
            },
            (err: any) => {
                console.error(err);
                this.parseServerError(err);
                this.processing = false;
            }
        );
    }

    private createLiveFile() {
        var formData = new FormData();
        var liveData = {
            title: this.title,
            begin_at: this.choosenDate ? Math.ceil(this.choosenDate.getTime() / 1000) : Math.ceil(Date.now() / 1000)
        };
        if (this.globalService.liveEditObject) {
            liveData['id'] = this.globalService.liveEditObject.filedata.live.id;
        }
        var blob = new Blob([JSON.stringify(liveData, null, 2)], {type: 'application/json'});
        formData.append('file_content', blob, this.title + '.live'); //need for add extension .live in filename

        return formData.get('file_content');
    }

    private createAccess() {
        let access = null;
        var file = this.globalService.liveEditObject;
        if (file) {
            access = {
                users: {}
            };
            Object.keys(file.access.users).map(function (objectKey, index) {
                access.users[objectKey] = [];
            });
        }
        if (this.participants.length) {
            access = access !== null ? access : {users: {}};
            this.participants.forEach((participant) => {
                access.users[participant.id] = ["read"];
            });
        }
        return access !== null ? JSON.stringify(access) : access;
    }

    private createChannels() {
        let channels = [this.globalService.login.data.general_channel.id];//set default general channel
        if (this.channels.length) {
            this.channels.forEach((channel) => {
                if (this.globalService.login.data.general_channel.id !== channel.id) {
                    channels.push(channel.id);
                }
            });
        }
        return channels !== null ? JSON.stringify(channels) : channels;
    }

    /**
     * Upload Process
     */
    private uploadProcess() {
        this.uploadService.progress$.subscribe();
    }

    filteredChannels(): Array<any> {
        let channels = this.channelService.getAllChannel();
        if (this.channelFilterName) {
            channels = channels.filter((channel) => {
                return channel.name.toLocaleLowerCase().indexOf(this.channelFilterName.toLocaleLowerCase()) !== -1;
            });
        }
        return channels;
    }

    filteredUsers(): Array<any> {
        let users = this.users;
        if (this.userFilterName) {
            users = users.filter((user) => {
                let isName = user.username.toLocaleLowerCase().indexOf(this.userFilterName.toLocaleLowerCase()) !== -1;
                let isEmail = user.email.toLocaleLowerCase().indexOf(this.userFilterName.toLocaleLowerCase()) !== -1;
                return isName || isEmail;
            });
        }

        return users;
    }

    filteredInvites(): Array<any> {
        let invites = this.invites;
        if (this.userFilterName) {
            invites = invites.filter((invite) => {
                return invite.email.toLocaleLowerCase().indexOf(this.userFilterName.toLocaleLowerCase()) !== -1;
            });
        }

        return invites;
    }

    onChangeFilterName(event) {
        this.checkAllChannels = false;
    }

    onChangeUserFilterName(event) {
        this.newInviteUser = this.createInviteUser(this.userFilterName);
    }

    onCheckAllChannels(event) {
        if (this.checkAllChannels) {
            this.filteredChannels().forEach((channel) => {
                if (!this.hasChannel(channel)) {
                    this.channels.push(channel);
                }
            });
        } else {
            this.filteredChannels().forEach((channel) => {
                let index = this.channels.indexOf(channel);
                if (index !== -1) {
                    this.channels.splice(index, 1);
                }
            });
        }
    }

    hasParticipant(user): boolean {
        return !!(this.participants.find((participant) => {
            return user.id === participant.id;
        }));
    }

    hasInvite(invite): boolean {
        return !!(this.invites.find((i) => {
            return i.email === invite.email;
        }));
    }

    hasChannel(chanel): boolean {
        return !!(this.channels.find((c) => {
            return chanel.id === c.id;
        }));
    }

    avatarSmall(user) {
        if (user.avatarUrl) {
            return user.avatardata.encodings.length ? user.avatardata.encodings[0].uri : false;
        }
        return false;
    }

    avatarFirstLetter(user) {
        return user.username.charAt(0);
    }

    private initLiveEditObject() {
        var file = this.globalService.liveEditObject;
        if (!file) {
            return;
        }
        this.title = file.name;

        var userIds: Array<any> = Object.keys(file.access.users);
        var contacts: Array<any> = this.globalService.contacts.filter((contact) => {
            return userIds.find((userId) => {
                return contact.contact_user.id == userId;
            });
        });
        this.participants = contacts.map((contact) => {
            return contact.contact_user;
        });
        this.invites = file.invites.map((invite) => {
            return this.createInviteUser(invite.email);
        });

        this.channels = this.channelService.getAllChannel().filter((channel) => {
            return file.channels_ids.indexOf(channel.id) !== -1;
        });

        this.dateTimePickerOptions.defaultDate = new Date(file.filedata.live.begin_at * 1000);
        this.choosenDate = this.dateTimePickerOptions.defaultDate;
    }

    get uploadUrl() {
        var file = this.globalService.liveEditObject;
        if (!file) {
            return this.globalService.apiUrl + 'files';
        }
        return this.globalService.apiUrl + `files/${file.id}`
    }

    isEmail(str: string) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str);
    }

    private createInviteUser(email: string): any {
        if (!this.isEmail(email)) {
            return;
        }
        if (this.hasInvite({email: email})) {
            return;
        }
        return {
            email: email,
            username: email,
            isInvite: true,
        };
    }

    private inviteNewContacts(id) {
        if (!this.invites.length) {
            return Observable.empty();
        }
        let formData: FormData = new FormData();

        this.invites.forEach((invite, index) => {
            formData.append('Invitecontact[' + index + '][email]', invite.email);
        });
        formData.append('shareAccess', JSON.stringify(["read"]));
        formData.append('shareId', id);

        return this.globalService.postRquest(this.globalService.apiUrl + 'invites/addbyemails', formData);
    }
    
    private parseServerError(err): void {
        var error = JSON.parse(err);
        if (error.response_status && error.response_status === 'error') {
            this.serverErrorMessage = error.response_data;
        }
    }
}