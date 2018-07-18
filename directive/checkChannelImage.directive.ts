/**
 * Created by radmilla on 22/01/2017.
 */
import {Directive, Input, ElementRef, Renderer2} from '@angular/core';

@Directive({
    selector: '[channelImage]',
})
export class ChannelImageDirective {
    constructor(
        private _elRef: ElementRef,
        private _renderer: Renderer2
    ) {}

    @Input() header: string;

    @Input() set channelImage(channel) {
        try {
            this._renderer.setAttribute(this._elRef.nativeElement, 'src', channel.avatardata.encodings[0].uri);
        } catch (e) {
            this._renderer.setAttribute(this._elRef.nativeElement, 'src', 'images/channel-prev-img.png');
        }
    }
}