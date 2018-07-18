/**
 * Created by radmilla on 22/01/2017.
 */
import {Directive, ElementRef} from '@angular/core';
import {GlobalService} from "../services/global.service";

@Directive({
    selector: '[clickOutside]',
    host: {
        '(document:click)': 'onClick($event)',
    },
})
export class CheckClickDirective {
    constructor(
        private _eref: ElementRef,
        public global: GlobalService,
    ) { }

    onClick(event) {
        if (!this._eref.nativeElement.contains(event.target)) {
            if(this._eref.nativeElement.classList.contains('search-input')) {
                this.global.charLeftSearchVisible = false;
            }
        }
    }
}