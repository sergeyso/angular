/**
 * Created by radmilla on 22/01/2017.
 */
import {Directive, Input, ElementRef, Renderer} from '@angular/core';

@Directive({
    selector: '[headerImage]',
})
export class CheckHeaderImageDirective {
    @Input() header: string;

    constructor(
        private _elRef: ElementRef,
        private _renderer: Renderer
    ) {}

    @Input() set headerImage(user) {
        this._elRef.nativeElement.innerHTML = '';
        if (user.type === 'user') {
            try {
                if (user.avatardata.encodings.length) {
                    const imgElement = this._renderer.createElement(this._elRef.nativeElement, 'img');
                    this._renderer.setElementAttribute(imgElement, 'src', user.avatardata.encodings[0].uri);
                    if (this.header === 'true') {
                        this._renderer.setElementClass(imgElement, 'close-user-dropdown-header', true);
                    }
                } else {
                    this.makeSpam(user);
                }
            } catch (e) {
                try {
                    this.makeSpam(user);
                } catch (e) {
                    console.log(e);
                }
            }
        } else {
            const imgElement = this._renderer.createElement(this._elRef.nativeElement, 'img');
            this._renderer.setElementAttribute(imgElement, 'src', this.getImageCompany(user));
            if (this.header === 'true') {
                this._renderer.setElementClass(imgElement, 'close-user-dropdown-header', true);
            }
        }
    }

    private getImageCompany(company) {
        try {
            return company.logo.link
        } catch (e) {
            return '/images/novp-logo.png';
        }
    }

    private makeSpam(user) {
        const initials = this.initialsUsername(user.fullname);
        const spanElement = this._renderer.createElement(this._elRef.nativeElement, 'span');
        if (this.header === 'true') {
            this._renderer.setElementClass(spanElement, 'close-user-dropdown-header', true);
        }
        this._renderer.createText(spanElement, initials);
    }

    private initialsUsername(fullname) {
        let initials: string = '';
        fullname.split(' ').forEach((a, e) => {
            initials = initials + a.charAt(0);
        });
        return initials.toUpperCase();
    }
}
