/**
 * Created by toni on 21.2.17.
 */
import {Directive, forwardRef, Input} from '@angular/core';
import { NG_VALIDATORS, FormControl } from '@angular/forms';

@Directive({
    selector: '[app-validateLink][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => LinkValidatorDirective), multi: true }
    ]
})
export class LinkValidatorDirective {

    @Input() object: any;
    validator: Function;

    constructor() {
        this.validator = this.validateEmailFactory();
    }

    validate(c: FormControl) {
        return this.validator(c);
    }

    protected validateEmailFactory() {
        return (c: FormControl) => {
            let error;
            const LINK_REGEXP = /^(?:http|https):\/\/[\w.\-]+(?:\.[\w\-]+)+[\w\-.,@?^=%&:;/~\\+#]+$/g;
            if (LINK_REGEXP.test(c.value)) {
                delete this.object.error;
                error = null
            } else {
                this.object.error = true;
                error = {
                    validateLink: {
                        valid: false
                    }
                };
            }
            return error;
        };
    }
}