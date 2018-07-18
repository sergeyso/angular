import {Component, EventEmitter, Output} from '@angular/core';
import {Response} from '@angular/http';

import {GlobalService} from '../../../services/global.service';
import {ChannelService} from '../../../services/channel.service';
import {FeedService} from '../../../services/feeds.service';
import {FolderService} from '../../../services/folder.service';
import {PostService} from '../../../services/post.service';
import {Post} from '../../../models/class/post/Post';


@Component({
    selector: 'app-edit-post',
    templateUrl: 'edit-post.html'
})
export class EditPostComponent {
    post: Post;
    searchChannelsInput: string = '';
    selectWhoToAskForm: boolean = false;
    selectChannelForm: boolean = false;
    message: string = '';
    channelName: string = '';
    channelId: number = 0;
    selectedChannel: number;
    loading: boolean = false;
    uploadedImage: string = '';
    @Output() closePopup: EventEmitter<boolean> = new EventEmitter();

    constructor(
        public globalService: GlobalService,
        public channelService: ChannelService,
        public postService: PostService,
        public feedService: FeedService,
        public folderService: FolderService
    ) {
        this.post = this.mapPost(this.globalService.postEditObject);
        this.getChannelName(this.globalService.postEditObject.channel_id);
    }

    updatePost() {
        const data = this.post;
        const formData: FormData = new FormData();

        for (const i in data) {
            if (data[i]) {
                formData.append(i, data[i]);
            }
        }
        this.postService.updatePost(data.id, formData)
             .subscribe(
                 (repsponse: Response) => {
                     this.feedService.refreshPage = true;
                     this.folderService.select('root', '', 'root', '');
                     this.globalService.editPostVisible = false;
                 }
             );
    }

    private getChannelName(existChannel): void {
        const channels = this.channelService.getAllChannel()

        for (let i = 0; i < channels.length; i++) {
            if (existChannel === channels[i].id) {
                this.channelName = channels[i].name;
                this.post.channel_id = channels[i].id;
            }
        }
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
     * Close popup and pass value to emitter
     */
    hidePopup(): void {
        this.globalService.editPostVisible = false;
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
     * Open select channel form
     */
    selectChannel(): void {
        this.selectWhoToAskForm = false;
        this.selectChannelForm = !this.selectChannelForm;
    }

    /**
     * Open select channel form
     */
    selectWhoToAsk(): void {
        this.selectWhoToAskForm = !this.selectWhoToAskForm;
        this.selectChannelForm = false;
    }

    /**
     * Select Channel to model
     * @param channel
     */
    inviteChannel(channel): void {
        this.selectChannelForm = false;
        this.channelName = channel.name;
        this.post.channel_id = channel.id;
    }


    /**
     * Take input name
     * @param event
     */
    onChangeFile(event): void {
        this.uploadedImage = event.target.files[0].name;
    }

    /**
     * Remove Seleced Image
     */
    removeSelectedImage(): void {
        this.uploadedImage = '';
    }

    private mapPost(editPost: any): Post {
        return new Post(editPost.channel_id, editPost.id, editPost.text, editPost.color);
    }
}