import {Component, EventEmitter, Output} from '@angular/core';
import {Response} from '@angular/http';

import {GlobalService} from '../../../services/global.service';
import {ChannelService} from '../../../services/channel.service';
import {FeedService} from '../../../services/feeds.service';
import {FolderService} from '../../../services/folder.service';
import {PostService} from '../../../services/post.service';
import {File} from '../../../models/class/file.model';


@Component({
    selector: 'app-edit-file',
    templateUrl: 'edit-file.html'
})
export class EditFileComponent {
    file: File;
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
        this.file = this.mapFile(this.globalService.postEditObject);
        this.getChannelName(this.globalService.postEditObject.channels_ids);
    }

    updateFile() {
        const data = this.file;
        const formData: FormData = new FormData();

        for (const i in data) {
            if (data[i]) {
                formData.append(i, data[i]);
            }
        }
        this.postService.updateFilePost(data.id, formData)
            .subscribe(
                (repsponse: Response) => {
                    this.feedService.refreshPage = true;
                    this.folderService.select('root', '', 'root', '');
                    this.globalService.editFileVisible = false;
                }
            );
    }

    private getChannelName(existsChannels): void {
        const channels = this.channelService.getAllChannel()

        for (let i = 0; i < channels.length; i++) {
            if (existsChannels.includes(channels[i].id)) {
                this.channelName = channels[i].name;
                this.file.channel_id = channels[i].id;
            }
        }
    }

    /**
     * Close popup and pass value to emitter
     */
    hidePopup(): void {
        this.globalService.editFileVisible = false;
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
        this.file.channel_id = channel.id;
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

    private mapFile(editFile: any): File {
        return new File(editFile.id, editFile.name, editFile.description, editFile.channel_id);
    }
}