import {Component} from '@angular/core';
import {GlobalService} from "../../../services/global.service";

@Component({
    selector: 'reseller-settings',
    templateUrl: 'reseller.html'
})
export class ResellerSettings  {
    user: any;
    showError: boolean = false;
    constructor(private global: GlobalService) {
        this.user = this.global.login.data;
        this.user.reseller_short_link = this.user.reseller_link.replace('https://knowlocker.com/', '');
    }

    showInDevelop() {
        this.showError = true;
        setTimeout(() => {
            this.showError = false;
        },3000);
    }
}