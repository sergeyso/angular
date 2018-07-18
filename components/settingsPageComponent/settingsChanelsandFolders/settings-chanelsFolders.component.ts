import {Component, EventEmitter, Output} from '@angular/core';
import {ChannelService} from "../../../services/channel.service";
import {Response} from "@angular/http";

@Component({
    selector: 'channel-folders',
    templateUrl: 'settings-chanelsFolders.html'
})
export class ChannelFoldersSettings {
    channel: any;
    channelIndex: number;
    channels: any[];
    addNewChannelVarVisible: boolean = false;
    deleteDialog: boolean = false;

    constructor(
        private channelService: ChannelService
    ) {
        this.channels = this.channelService.settingsChannels;
    }

    closeAddChannelChild() {
        this.channel = false;
        this.addNewChannelVarVisible = !this.addNewChannelVarVisible;
    }

    openCreateChannel() {
        this.channel = false;
        this.addNewChannelVarVisible = true;
    }

    closeDeleteDialog(event: boolean) {
        this.deleteDialog = event;
    }

    editChannel(index: number) {
        this.channelIndex = index;
        this.channel = this.channels[index];
        this.addNewChannelVarVisible = true;
    }

    clickDelete(index: number) {
        this.channelIndex = index;
        this.channel = this.channels[index];
        this.deleteDialog = true;
    }

    deleteConfirmed(event: boolean) {
        if (event) {
            this.removeChannel();
        }
    }

    removeChannel() {
        this.channelService.removeChannel(this.channel.id)
            .subscribe(
                (response: Response) => {
                    this.channels.splice(this.channelIndex, 1);
                }
            );
    }
}