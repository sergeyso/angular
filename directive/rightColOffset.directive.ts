/**
 * Created by radmilla on 22/01/2017.
 */
import {Directive,  ElementRef} from '@angular/core';
import {GlobalService} from "../services/global.service";


@Directive({
    selector: '[RightColumnOffset]',
    host: {
        '(window:resize)': 'onScroll()',
        '(window:load)': 'onScroll()'
    }
})

export class RightColumnOffset {
    constructor(
        private _el: ElementRef,
        private global: GlobalService
    ) {}

    onScroll(){
        let windowHeight = "innerHeight" in window ? window.innerHeight
            : document.documentElement.offsetHeight;
        this.global.scrollbarRightColHeigt =  (windowHeight - this._el.nativeElement.offsetTop)-100;
    }
}