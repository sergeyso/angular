import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {GlobalService} from '../../services/global.service';
import {UploadService} from '../../services/uploadFile.service';
import {FolderService} from '../../services/folder.service';
import {FeedService} from '../../services/feeds.service';
import {Post} from '../../models/class/post/Post';
import {ChannelService} from '../../services/channel.service';
import {Access} from '../../models/class/access/file.model';
import {count} from 'rxjs/operator/count';
import {ResponseApi} from '../../models/interfaces/responseApi.interface';

@Component({
    selector: 'upload-form',
    templateUrl: 'upload-form.html'
})
export class UploadFormComponent {
    @ViewChild('commentFormField') commentFormField;
    selectedTab: number = 1;
    post: Post;
    fileName: string = '';
    @Output() close = new EventEmitter();
    @Output() zindex = new EventEmitter();
    submit: boolean = false;
    disabled: boolean = false;
    errorMessage: string = '';
    searchChannelsInput: string = '';
    searchContactInput: string = '';
    selectChannelsVar: boolean = false;
    selectPrivacyVar: boolean = false;
    placeholder: boolean = true;
    postPrivacy: string = '';
    channel: string = 'General';
    selectContacts: Array<any> = [];
    selectedContacts: Array<any> = [];
    emails: any = '';
    securityModalStatus: boolean = false;
    commentHeight: string = 'auto';

    constructor(public globalService: GlobalService,
                public uploadService: UploadService,
                public folderService: FolderService,
                public feedService: FeedService,
                public channelService: ChannelService) {
        this.uploadProcess();
        this.setGeneralChannelToPost();
        if (this.channelService.channel !== false) {
            this.inviteChannel(this.channelService.channel);
        }
    }

    resizeScroll(event) {
        this.post.text = event.srcElement.innerHTML;
        if (this.commentFormField.nativeElement.clientHeight < 350) {
            this.commentHeight = 'auto';
        } else {
            this.commentHeight = '350px';
        }
    }

    /**
     * Set general channel to post
     */
    private setGeneralChannelToPost() {
        try {
            this.post = new Post(this.globalService.login.data.general_channel.id);
        } catch (e) {
            this.post = new Post(null);
        }

    }

    togglePostFormEmit(value) {
        this.close.emit(value);
    }

    /**
     * On Change CheckBox
     * @param value
     * @returns {any}
     */
    onChangeCheckBox(value) {
        if (value !== this.post.color) {
            return this.post.color = value;
        }
        this.post.color = '';
    }

    /**
     * Submit form
     */
    uploadFileFunction() {
        this.submit = true;
        if (!this.post.text) {
            this.errorMessage = 'You must add text';
            setTimeout(() => {
                this.errorMessage = '';
            }, 3000);
            return;
        }

        this.prepareRequest();
    }

    /**
     * Prepare Request
     */
    private prepareRequest() {
        this.addAccessToPost();
        return this.uploadPost(this.post, this.globalService.apiUrl + 'posts', 'post')
    }

    /**
     * Add access to post
     */
    private addAccessToPost() {
        this.post.access = JSON.stringify(new Access(this.accessStructure().accessUser));
        this.emails = this.emails.split(',').filter(
            (email) => {
                return email.trim();
            }
        );
        this.post.emails = JSON.stringify(this.emails.map(
            (email) => {
                return email.trim();
            }));
    }

    /**
     * Make http request
     * @param {Object} object
     * @param {string} url
     * @param {string} type
     */
    private uploadPost(object: Object, url: string, type: string) {
        this.disabled = true;
        this.uploadService.upload(object, url).subscribe(
            (uploads: ResponseApi) => {
                this.feedService.refreshPage = true;
                if (this.channelService.channel !== false) {
                    this.folderService.select(this.channelService.channelSelected, this.channelService.channel.id,
                        'channel', this.channelService.channel);
                } else {
                    this.folderService.select('root', '', 'root', '');
                }
                this.close.emit(false);
                this.disabled = false;
            },
            (err: any) => {
                this.close.emit(false);
                this.disabled = false;
            }
        );
    }

    /**
     * Return Object for share files
     * @returns {Object}
     */
    accessStructure() {
        const objectInteger: Object = {};
        if (this.selectContacts.length) {
            this.selectContacts.forEach((a: any, e) => {
                objectInteger[a.contact_user.id] = ['read'];
            });
        }

        return {
            accessUser: objectInteger,
        };
    }

    /**
     * Upload Process
     */
    private uploadProcess() {
        this.uploadService.progress$.subscribe();
    }

    selectChannels() {
        this.selectChannelsVar = !this.selectChannelsVar;
        this.selectPrivacyVar = false;
    }

    /**
     * Select Contacts to model
     */
    selectPrivacy() {
        this.selectedContacts = this.selectContacts.slice();
        this.selectPrivacyVar = !this.selectPrivacyVar;
        this.selectChannelsVar = false;
    }

    /**
     * Select Channel to model
     * @param channel
     */
    inviteChannel(channel): void {
        this.post.channel_id = channel.id;
        this.channel = channel.name;
        this.selectChannelsVar = false;
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

    showSecurity() {
        this.securityModalStatus = true;
        this.zindex.emit(110);
    }

    closeSecurity(status: boolean) {
        this.securityModalStatus = !status;
        this.zindex.emit(100);
    }
}
