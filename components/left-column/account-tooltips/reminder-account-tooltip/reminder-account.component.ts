import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {Response} from '@angular/http';

import {GlobalService} from '../../../../services/global.service';

@Component({
    selector: 'popup-reminder-account',
    templateUrl: 'reminder-account.html'
})
export class ReminderAccountTooltipComponent implements OnInit {
    @Output() closeModal = new EventEmitter<boolean>();

    companies = [];
    topBannerPosition: number;

    constructor(
        public global: GlobalService,
    ) { }

    ngOnInit() {
        this.global.setCompanies()
            .subscribe((response: Response) => {
                this.companies = response.json().response_data;

                this.topBannerPosition = this.getTopBannerPosition();
            });
    }

    hidePopup() {
        this.closeModal.emit(false);
        return false;
    }

    getTopBannerPosition(): number {
        if (this.global.login.data.company_id == null) {
            return 0;
        } else {
            for (let i = 0; i <= this.companies.length; i++) {
                if (this.companies[i].id === this.global.login.data.company_id) {
                    return i + 1;
                }
            }
        }
    }
}
