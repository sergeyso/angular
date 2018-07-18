/**
 * Created by radmilla on 22/01/2017.
 */
import {Directive, Input, ElementRef, Renderer2} from '@angular/core';

@Directive({
    selector: '[leftCompany]',
})
export class CompanyImageDirective {
    constructor(
        private _elRef: ElementRef,
        private _renderer: Renderer2
    ) {}

    @Input() set leftCompany(company) {
        try {
            this._renderer.setAttribute(this._elRef.nativeElement, 'src', company.logo.link);
        } catch (e) {
            this._renderer.setAttribute(this._elRef.nativeElement, 'src', '/images/novp-logo.png');
        }
    }
}