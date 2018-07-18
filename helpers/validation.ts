import {NgForm, NgModel} from "@angular/forms";
declare let $: any;
/**
 * Created by t_mit on 1/30/2017.
 */
export class ValidationForm {
    /**
     * Email Validation
     * @param value
     * @return {boolean}
     */
    static email(value) {
        const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        return EMAIL_REGEXP.test(value);
    }

    static file(btn: any) {
        const ext = $(btn).val().split('.').pop().toLowerCase();
        if (ext) {
            if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'mp4', 'flv', 'mov', 'avi', 'docx', 'xlsx', 'pptx', 'doc', 'xls', 'ppt', 'pdf', 'gif']) == -1) {
                return false;
            } else {
                return true;
            }
        }
        return true;
    }

    static checkValid(form): void {
        for (const key in form.controls) {
            form.controls[key].markAsDirty();
        }
    }

    static validate(event: any) {
        let key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46
            || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        }
        else if ( key > 95 && key < 106 ) {
            return true;
        }
        else if ( key < 48 || key > 57 ) {
            return false;
        }
        else return true;
    }

    file(btn: any) {
        let ext = $(btn).val().split('.').pop().toLowerCase();
        if(ext) {
            if($.inArray(ext, ['png', 'jpg', 'jpeg', 'mp4', 'flv', 'mov', 'avi', 'docx', 'xlsx', 'pptx', 'doc', 'xls', 'ppt', 'pdf', 'gif']) == -1) {
                return false;
            } else {
                return true;
            }
        }
        return true;
    }

    checkExtension(event, file: NgModel, option: string) {
        file.control.markAsDirty();
        if(!this[option](event.target)) {
            file.control.setValidators(this.validationFile);
            file.control.setErrors({
                "validationFile": true
            });
        } else {
            file.control.clearValidators();
            file.control.setErrors(null);
        }
    }

    validationFile() {
        return {
            validationFile: true
        }
    }

    image(btn: any) {
        let ext = $(btn).val().split('.').pop().toLowerCase();
        if(ext) {
            if($.inArray(ext, ['png', 'jpg', 'jpeg']) == -1) {
                return false;
            } else {
                return true;
            }
        }
        return true;
    }


}