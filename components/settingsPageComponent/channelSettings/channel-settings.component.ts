import {Component, AfterViewInit, ViewChild} from '@angular/core';
import {ChannelService} from "../../../services/channel.service";
import {Channel} from "../../../models/class/channel.model";
import {FeedService} from "../../../services/feeds.service";
import {GlobalService} from "../../../services/global.service";
import {ChannelUpdate} from "../../../models/channelUpdate.model";
import {ValidationForm} from "../../../helpers/validation";
import {NgForm} from "@angular/forms";
import * as readurl from "../../../helpers/readFile"
import {UploadService} from "../../../services/uploadFile.service";
declare var $: any;

@Component({
    selector: 'channel-settings',
    templateUrl: 'channel-settings.html'
})
export class ChannelSettings implements AfterViewInit{
    page = 0;
    channelAvatarName: string = 'Browse file';
    availableRegion:any;
    channel: Channel = new Channel;
    channelUpdate: ChannelUpdate = new ChannelUpdate;
    removeFilesIds:Array<any> = [];
    loadNewChannel: boolean = true;
    finished: boolean = false;
    confirmMessage: string = '';
    loadIconShow: boolean = false;
    inputFile: any;
    errorExtensionFile: boolean = true;
    @ViewChild('submitChannel') submitChannel: NgForm;
    url:any = '';
    /**
     * false for insert, true for updated
     */
    action: boolean = false;
    constructor(
        public globalService: GlobalService,
        public channelService: ChannelService,
        public feedService: FeedService,
        private uploadService: UploadService,
    ) {
        this.uploadService.progress$.subscribe((data: number) => {});
        this.channelService.filesIds = [];
        this.getIdsFromChannel();
        this.getChannel();
        this.checkFiles();
    }

    private checkFiles() {
        if (!this.globalService.paginateFeeds.length) {
            this.getFileSelf()
        }
    }

    private getFileSelf() {
        this.page = this.page + 1;
        this.feedService.filesSelf(this.page).subscribe(
            (feeds: Response) => {
                let feedsGroup = feeds.response_data;
                if(this.feedService.filterTypeActive) {
                    feedsGroup = this.feedService.filteredFeed(feeds.response_data);
                    this.feedService.listFeed(feedsGroup);
                } else {
                    this.feedService.listFeed(feedsGroup);
                }

                this.feedService.listFeedCache(feeds.response_data);
                this.loadNewChannel = false;
                if (!feedsGroup.length) {
                    this.getFileSelf();
                } else if (this.globalService.paginateFeeds.length < 11) {
                    this.getFileSelf();
                }
            },
            (error: any) => {
                this.loadNewChannel = false;
                this.finished = true;
                console.error(error);
            }
        );
    }

    onChangeFile(event) {
        this.inputFile = event.target;
        this.channelUpdate.file_avatar = this.inputFile.files[0];
        this.channelAvatarName = event.target.files[0].name;
        this.errorExtensionFile = ValidationForm.file(this.inputFile);
        readurl.readUrl(event).then(
            isSuccess => {
                this.url = isSuccess;
            }
        )
    }

    ngAfterViewInit() {
        this.availableRegionSelect();
        this.regionsSelectChange();
        this.onScroll();
    }

    /* Available Regions Select2 */
    private availableRegionSelect() {
        this.availableRegion = $('#regions').select2({
            data: this.channelService.countries,
            multiple: true,
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange"
        });

        if(this.channelUpdate.countries.length) {
            let array = [];
            let count = this.channelUpdate.countries.length;
            this.channelUpdate.countries.forEach((element: any, index:number) => {
                array.push(element.id);
                if(count == index+1) {
                    $('#regions').val(array).trigger("change");
                    this.channelUpdate.syncCountryIds = array;
                }
            });
        }

    }

    /*Privay Select2*/
    private regionsSelectChange() {
        this.availableRegion.on('change', (e: any) => {
            this.channelUpdate.syncCountryIds = JSON.stringify($(e.target).val());
        });
    }

    private getChannel() {
        try {
            if(this.channelService.channels.length) {
                this.channel = this.channelService.channels[0];
                this.channelUpdate.name = this.channel.name;
                this.channelUpdate.is_free = this.channel.is_free;
                this.channelUpdate.id = this.channel.id;
                this.channelUpdate.countries = this.channel.countries;
                if(Object.getOwnPropertyNames(this.channel.avatardata).length) {
                    this.url = this.channel.avatardata.link
                }
                this.action = true;
            }
        } catch (e) {
            console.error(e)
        }
    }

    selectedFile(file) {
        let count = this.channelService.filesIds.indexOf(file.id);
        if(count > -1) {
            this.removeFilesFromChannel(count)
        } else {
            this.addFileFromChannel(file);
        }
    }


    private removeFilesFromChannel(count) {
        let object = this.channelService.filesIds.splice(count, 1);
        this.removeFilesIds.push(object[0]);
    }

    private addFileFromChannel(file) {
        this.channelService.filesIds.push(file.id);
        let foundInDelete = this.removeFilesIds.indexOf(file.id);
        if(foundInDelete > -1) {
            this.removeFilesIds.splice(foundInDelete, 1);
        }
    }

    getIdsFromChannel() {
        this.channelService.filesIds = this.channelService.filesFromChannel;
    }

    private onScroll() {
        let object = this;
        $('#scrollbar-element').on('scroll', function() {
            if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                if(!object.finished) {
                    object.loadNewChannel = true;
                    object.getFileSelf();
                }
            }
        })
    }

    filterFeedsByType(value) {
        this.feedService.filterTypeActive = value;
        if (this.feedService.filterTypeActive === '') {
            this.globalService.paginateFeeds = this.globalService.paginateFeedsCache;
        } else {
            this.globalService.paginateFeeds = this.feedService.filteredFeed(this.globalService.paginateFeedsCache);
            if (this.globalService.paginateFeeds.length < 11 && !this.finished) {
                this.getFileSelf();
            }
        }
    }

    submitFormChannel() {
        try {
            ValidationForm.checkValid(this.submitChannel);
            if (this.submitChannel.valid && this.errorExtensionFile) {
                this.checkIsUpdateOrNew()
            }
        } catch (e) {
            console.error(e);
        }
    }

    private checkIsUpdateOrNew() {
        let object = this.prepeareChannelObject();
        if(this.action) {
            this.updateOrCreateChannel(this.globalService.apiUrl+'channels/'+object.id, object);
        } else {
            this.updateOrCreateChannel(this.globalService.apiUrl+'channels', object);
        }
    }

    private prepeareChannelObject() {
        if(this.channelService.filesIds.length) {
            this.channelUpdate.addFilesIds = JSON.stringify(this.channelService.filesIds);
        }
        if(this.removeFilesIds.length) {
            this.channelUpdate.deleteFilesIds = JSON.stringify(this.removeFilesIds);
        }

        return this.channelUpdate;
    }

    updateOrCreateChannel(url: string, model:Object) {
        this.loadIconShow = true;
        this.uploadService.upload(model, url).subscribe(
            (uploads: any) => {
                if(uploads.response_status = "success") {
                    this.channelService.filesFromChannel = uploads.response_data;
                    this.confirmMessage = "Successfully update";
                    setTimeout(() => {
                        this.confirmMessage = ''
                    }, 5 * 1000);
                    this.loadIconShow = false;
                }
            },
            (err: any) => {
                this.loadIconShow = false;
                console.log(err);
            });
    }


}