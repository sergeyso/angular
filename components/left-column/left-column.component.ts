import {Component, Input, OnChanges, ViewChild} from '@angular/core';
import {GlobalService} from '../../services/global.service';
import {ChannelService} from '../../services/channel.service';
import {FolderService} from '../../services/folder.service';

import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import {VaultService} from "../../services/vault.service";

@Component({
    selector: 'left-column',
    templateUrl: 'left-column.html',
    styleUrls: ['left-column.scss']
})
export class LeftColumn implements OnChanges {
    @Input() scrollToContacts: boolean = false;
    @Input() scrollToFolders: boolean = false;
    @Input() scrollToMeetings: boolean = false;
    @Input() scrollToVault: boolean = false;
    @Input() channelsLoaded: boolean = false;
    addNewChannelVarVisible: boolean = false;
    addCompanyChannelVisible: boolean = false;
    channelLinksVisible: boolean = false;
    @ViewChild('channelLink') channelLink;
    @ViewChild('clickOpenChannel') clickOpenChannel;
    @ViewChild('contactColumn') contactColumn;
    @ViewChild('foldersColumn') foldersColumn;
    @ViewChild('meetingsColumn') meetingsColumn;
    @ViewChild('vaultColumn') vaultColumn;
    @ViewChild(PerfectScrollbarComponent) componentScroll: PerfectScrollbarComponent;

    constructor(
        public global: GlobalService,
        public channelService: ChannelService,
        public folderService: FolderService,
        public vaultService: VaultService
    ) {}

    ngOnChanges () {
        if (this.scrollToContacts) {
            let y = this.contactColumn.mainBox.nativeElement.offsetTop;
            this.componentScroll.directiveRef.scrollTo(0, y, 500);
        }

        if (this.scrollToFolders) {
            let y = this.foldersColumn.mainBox.nativeElement.offsetTop;
            this.componentScroll.directiveRef.scrollTo(0, y, 500);
        }

        if (this.scrollToMeetings) {
            let y = this.meetingsColumn.mainBox.nativeElement.offsetTop;
            this.componentScroll.directiveRef.scrollTo(0, y, 500);
        }

        if (this.scrollToVault) {
            let y = this.vaultColumn.mainBox.nativeElement.offsetTop;
            this.componentScroll.directiveRef.scrollTo(0, y, 500);
        }

        if (this.channelsLoaded) {
            if (this.global.login.data.company_id === 8 && this.channelService.channelSelected === undefined) {
                this.channelService.getAllChannel().map((elem, index) => {
                    if (elem.id === 19771) {
                        this.channelService.channelSelected = index;
                        return;
                    }
                });
            }
            if (this.channelService.channelSelected !== undefined) {
                const channel = this.channelService.getAllChannel()[this.channelService.channelSelected];
                this.openChannel(channel, this.channelService.channelSelected);
            }
        }
    }

    /**
     * Show new channel component
     */
    showAddNewChannel() {
        this.channelLinksVisible = false;
        if (this.global.login.data.company_id) {
            this.addCompanyChannelVisible = true;
        } else {
            this.addNewChannelVarVisible = true;
        }

    }

    /**
     * Close popup for adding new channel
     * @param event
     */
    closeAddChannelChild(event) {
        this.addNewChannelVarVisible = event;
    }

    closeAddCompanyChannelChild(event) {
        this.addCompanyChannelVisible = event;
    }

    /**
     * List Channel Files
     * @param channel
     * @param i
     */
    openChannel(channel, i) {
        this.channelService.channelSelected = i;
        this.channelService.channel = channel;
        this.folderService.select(i, channel.id, 'channel', channel);
    }

    // openChannelsLinks() {
    //     this.channelLinksVisible = !this.channelLinksVisible;
    // }
    //
    // @HostListener('document:click', ['$event'])
    // clickout(event) {
    //     if (!this.clickOpenChannel.nativeElement.contains(event.target) && this.channelLink && this.clickOpenChannel) {
    //         this.clickChannel(event);
    //     }
    // }
    //
    // /**
    //  * Click Private Channel
    //  * @param event
    //  */
    // private clickChannel(event): void {
    //     if (!this.channelLink.nativeElement.contains(event.target)) {
    //         this.channelLinksVisible = false;
    //     }
    // }

}