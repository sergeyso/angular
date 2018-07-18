/**
 * Created by radmilla on 22/01/2017.
 */
import {AfterViewInit, Directive, ElementRef} from '@angular/core';
import {GlobalService} from '../services/global.service';


@Directive({
    selector: '[popupHight]'
})

export class PopupHeightDirective implements AfterViewInit{
    constructor(
        private _el: ElementRef,
        private global: GlobalService
    ) {}


    ngAfterViewInit() {
        this.global.popupHeight = this._el.nativeElement.offsetHeight - 150;
    }
}