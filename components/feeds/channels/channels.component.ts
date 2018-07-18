import {Component} from '@angular/core';

@Component({
    selector: 'channel-component',
    templateUrl: 'channels.html'
})
export class ChannelsComponent {
    channelSubscribed:boolean = false;
    channelSubscribeText:string = 'Subscribe';
    /**
     * Subscribe to channel
     */
    subscribeChannel() {
        this.channelSubscribed = !this.channelSubscribed;
        this.channelSubscribeText = (this.channelSubscribeText === 'Subscribe') ? 'Unsubscribe' : 'Subscribe';
    }

    /**
     * Open cluster in popup, we need to show in slider here
     */
    openClusterAlbum() {};
}