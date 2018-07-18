import {Component, EventEmitter, Input} from '@angular/core';
import {CookieService} from 'ng2-cookies';

import {GlobalService} from '../../../services/global.service';

@Component({
    selector: 'app-account-tooltips',
    templateUrl: 'account-tooltips.html',
    providers: [ CookieService ],
})
export class AccountTooltipsComponent {
    @Input() companies;

    onboardingCookie: Object = null;
    reminderCookie: Object = null;

    personalAccountStatus: boolean = false;
    reminderAccountStatus: boolean = false;

    currentStep: string;

    constructor(
        public global: GlobalService,
        public cookieService: CookieService
    ) {
        this.onboardingCookie = this.cookieService.get('onboarding');

        if (this.onboardingCookie === '') {
            this.personalAccountStatus = true;
        } else {
            this.currentStep = this.onboardingCookie.toString();
        }

        this.reminderCookie = this.cookieService.get('reminder');
        if (this.onboardingCookie === 'complete' && this.reminderCookie !== 'hide') {
            this.reminderAccountStatus = true;
        }
    }

    personalAccountEvent (status: boolean) {
        this.cookieService.set('onboarding', '0');
        this.currentStep = '0';
        this.personalAccountStatus = status;
    }

    organisationAccountEvent (status: any) {
        this.cookieService.set('onboarding', status.index);
        this.currentStep = status.index;

        if (this.companies.length > 0 && (this.companies.length === status.index)) {
            this.cookieService.set('onboarding', 'complete');
        }
    }

    reminderAccountEvent (status: boolean) {
        this.cookieService.set('reminder', 'hide', 5);
        this.reminderAccountStatus = status;
    }
}
