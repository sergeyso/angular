import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {GlobalService} from '../../../../services/global.service';
import {ValidationForm} from '../../../../helpers/validation';
import {ResponseApi} from '../../../../models/interfaces/responseApi.interface';
import {ChannelService} from '../../../../services/channel.service';

@Component({
    selector: 'add-new-channel',
    templateUrl: 'add-new-channel.html'
})
export class AddNewChannelPopup implements OnInit {
    @Input() channel: any;
    @Input() channelIndex: number;
    title: string = 'New Channel';
    monetizationBlockVisible: boolean = false;
    name: string = '';
    route: string = '';
    description: string = '';
    loadingChannelNew: boolean = false;
    errorRouteUnuique: string = '';
    /** Create event emitter to emit click on parent component */
    @Output() closeAddChannel: EventEmitter<boolean> = new EventEmitter();

    constructor(
        public globalService: GlobalService,
        public channelService: ChannelService
    ) {}

    ngOnInit() {

        if (this.channel) {
            this.name = this.channel.name;
            this.route = this.channel.route;
            this.title = 'Edit Channel';
        }
    }

    /**
     * Close pop up for monetization
     * @param event
     */
    closeMonetizationBlock(event): void {
        if (!event.target.classList.contains('add-new-monetization-c')) {
            this.monetizationBlockVisible = false;
        }
    }

    /**
     * Close popup and pass value to emitter
     */
    hidePopup(): void {
        this.closeAddChannel.emit(false);
    }

    /**
     * Create New Channel
     * @param {NgForm} form
     */
    createNewChannel(form: NgForm) {
        ValidationForm.checkValid(form);
        if (form.valid) {
            let url = 'channels';
            if (this.channel) {
                url = 'channels/' + this.channel.id;
            }
            this.loadingChannelNew = true;
            this.globalService.postRquest(this.globalService.apiUrl + url, {
                name: this.name,
                route: this.route ? this.route : this.uniqueId()
            }).subscribe(
                (isSuccess: ResponseApi) => {
                    if (this.channel) {
                        this.objectValuesRewrite(isSuccess.response_data[0], this.channelService.channels[this.channelIndex]);
                    } else {
                        this.channelService.channels.push(...isSuccess.response_data);
                        this.channelService.settingsChannels.push(...isSuccess.response_data)
                    }
                    this.loadingChannelNew = false;
                }, error2 => {
                    this.errorRouteUnuique = error2;
                    setTimeout(() => { this.errorRouteUnuique = '' }, 3000);
                    this.loadingChannelNew = false;
                }, () => {
                    this.hidePopup();
                }
            )
        }
    }

    uniqueId = () => {
        return Math.random().toString(36).substr(2, 16);
    };

    objectValuesRewrite = (from, to) => {
        let keys = Object.keys(from);
        for (let key of keys){
            if (typeof from[key] == 'object' && from[key]) {
                if (Array.isArray(from[key])) {
                    to[key] = [];
                }else {
                    to[key] = {};
                }
                this.objectValuesRewrite(from[key], to[key]);
            }else{
                to[key] = from[key];
            }
        }
    };
}
