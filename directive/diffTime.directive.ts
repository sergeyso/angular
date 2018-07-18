/**
 * Created by radmilla on 22/01/2017.
 */
import {Directive, Input, ElementRef} from '@angular/core';

@Directive({
    selector: '[diffTime]',
})
export class DiffTimeFeedDirective {

    constructor(
        private _elRef: ElementRef,
    ) {}

    @Input() set diffTime(value: number) {
        const timeDiff: number = Math.abs(new Date().getTime() - value * 1000);
        this._elRef.nativeElement.innerHTML = this.returnDate(Math.trunc(timeDiff / 36e5 * 60));
    }

    /**
     * @param minutes
     * @returns {string}
     */
    private returnDate(minutes: number) {
        let backDate: string;
        switch(true) {
            case minutes <= 1:
                backDate = 'now';
                break;
            case minutes > 1 && minutes < 60:
                backDate = Math.trunc(minutes) + 'm';
                break;
            case minutes > 60 && (minutes / 60) < 24:
                backDate = Math.trunc(minutes / 60) + 'h';
                break;
            case (minutes / 60) >= 24:
                backDate = Math.trunc(minutes / 60 / 24) + 'd';
                break;
        }
        return backDate
    }
}
