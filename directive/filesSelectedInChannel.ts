/**
 * Created by t_mit on 2/20/2017.
 */
import {Directive, Input} from '@angular/core';
import {ChannelService} from "../services/channel.service";

@Directive({
    selector: '[files]',
})

export class ChannelFilesIdsDirective {
    constructor(
        private channelService: ChannelService
    ) {}

    @Input() set files(value) {
        this.channelService.filesIds.push(value.id)
    }
}