import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';

@Component({
    selector: 'popup-organisation-account',
    templateUrl: 'organisation-account.html'
})
export class OrganisationAccountTooltipComponent implements OnInit {
    onboardingCompanyId: number = 8;

    @Input() company: any;
    @Input() index: number;
    @Input() currentStep: number;

    top: number;
    _company: any;

    @Output() closeModal = new EventEmitter<any>();

    ngOnInit() {
        this.top = this.index;
        this._company = this.company;
    }

    hidePopup(index: number) {
        this.closeModal.emit({index: index, isShow: false});
        return false;
    }
}
