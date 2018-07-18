/**
 * Created by radmilla on 22/01/2017.
 */
import {Directive,  ElementRef} from '@angular/core';
import {GlobalService} from "../services/global.service";


@Directive({
    selector: '[foldersOffset]',
    host: {
        '(window:resize)': 'onScroll()',
        '(window:load)': 'onScroll()'
    }
})

export class FolderOffsetDirective {
    constructor(
        private _el: ElementRef,
        private global: GlobalService
    ) {}

    onScroll(){
        let windowHeight = "innerHeight" in window ? window.innerHeight
            : document.documentElement.offsetHeight;
        this.global.scrollbarHeigt =  windowHeight - this._el.nativeElement.offsetTop;
    }
}