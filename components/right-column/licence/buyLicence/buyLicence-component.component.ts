import {Component} from '@angular/core';
import {RshService} from "../../../../services/rsh.service";
import {LicenceService} from "../../../../services/licence.service";

@Component({
    selector: 'buy-licence',
    templateUrl: 'buyLicence-component.html'
})
export class BuyLicenceComponent {

    constructor (
        public rhsService: RshService,
        public licenceService: LicenceService,
    ) {}

    onSubmitBuyLicencing() {
        this.rhsService.showColumn('pay_licence')
    }
}