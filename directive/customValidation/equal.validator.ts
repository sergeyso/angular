/**
 * Created by t_mit on 3/21/2017.
 */
import { Directive, forwardRef, Attribute } from '@angular/core';
import { NG_VALIDATORS, FormControl } from '@angular/forms';

@Directive({
    selector: '[validateEqual][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidator), multi: true }
    ]
})
export class EqualValidator {

    validator: Function;

    constructor(@Attribute('validateEqual') public validateEqual: string,
                @Attribute('reverse') public reverse: string) {
        this.validator = this.validateEqualPassword();
    }

    validate(c: FormControl) {
        return this.validator(c);
    }

    private get isReverse() {
        if (!this.reverse) return false;
        return this.reverse === 'true' ? true: false;
    }

    protected validateEqualPassword() {
        return (c: FormControl) => {
            // self value
            let v = c.value;

            // control vlaue
            let e = c.root.get(this.validateEqual);

            // value not equal
            if (e && v !== e.value && !this.isReverse) {
                return {
                    validateEqual: true
                }
            }

            // value equal and reverse
            if (e && v === e.value && this.isReverse) {
                delete e.errors['validateEqual'];
                if (!Object.keys(e.errors).length) e.setErrors(null);
            }

            // value not equal and reverse
            if (e && v !== e.value && this.isReverse) {
                e.setErrors({ validateEqual: true });
            }

            return null;
        };
    }
}