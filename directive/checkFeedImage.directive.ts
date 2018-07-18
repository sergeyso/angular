/**
 * Created by radmilla on 22/01/2017.
 */
import {Directive, Input, ElementRef, Renderer, Renderer2} from '@angular/core';
import {GlobalService} from "../services/global.service";

@Directive({
    selector: '[feedImage]',
})
export class FeedImageDirective {
    constructor(
        private _elRef: ElementRef,
        private _renderer: Renderer2,
        private globalService: GlobalService
    ) {}

    @Input() version: number;

    @Input() set feedImage(value) {
        try {
            value = this.globalService.getValueFormImageFeed(value);
            this._renderer.setAttribute(this._elRef.nativeElement, 'src', value.encodings[this.version].uri);
        } catch (e) {
            this._renderer.setAttribute(this._elRef.nativeElement, 'src', '/images/default.png');
        }
    }
}