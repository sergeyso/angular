/**
 * Created by radmilla on 22/01/2017.
 */
import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {GlobalService} from '../services/global.service';

@Directive({
    selector: '[appShareNumb]',
})
export class ShareNumberDirective {

    constructor(
        private _elRef: ElementRef,
        private _renderer: Renderer2,
        private globalService: GlobalService
    ) {}

    // @Input() set appShareNumb(value) {
    //     try {
    //         const array = [];
    //         if (Array.isArray(value)) {
    //             value.forEach((objectKey, index) => {
    //                 if (parseInt(objectKey) !== this.globalService.login.data.id) {
    //                     array.push(index)
    //                 }
    //             });
    //         } else {
    //             Object.keys(value).forEach((objectKey, index) => {
    //                 if (parseInt(objectKey) !== this.globalService.login.data.id) {
    //                     array.push(index)
    //                 }
    //             });
    //         }
    //         if (array.length !== 0){
    //             this._elRef.nativeElement.innerHTML = ` (${array.length}) `;
    //         }
    //     } catch (e) {
    //         //
    //     }
    // }

    @Input() set appShareNumb(value) {
        try {
            if (value !== 0) {
                this._elRef.nativeElement.innerHTML = ` (${value}) `;
            }
        } catch (e) {
            //
        }
    }
}
