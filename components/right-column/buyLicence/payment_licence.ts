import {Component} from '@angular/core';
import {RshService} from "../../../services/rsh.service";
import {GlobalService} from "../../../services/global.service";
import {LicenceService} from "../../../services/licence.service";
import {Pay} from "../../../models/class/licenceFileOption/pay";
declare var $: any;

@Component({
    selector: 'payment-licence',
    templateUrl: 'payment_licence.html'
})
export class PaymentLicence {
    creditCardVar:any;
    monthVar:any;
    yearVar:any;
    card_number:any = '';
    pay: Pay = new Pay(
        this.globalService.rightColumnValueFeed.id,
        this.licenceService.price
    );
    errorMessage: string = '';
    constructor(
        public globalService: GlobalService,
        public rhsService: RshService,
        public licenceService: LicenceService,
    ) {}

    //Buy Licencing select@
    ngAfterViewInit() {
        this.subscribecreditCard();
        this.monthSelect2();
        this.yearSelect2();
        this.plugins();
    };
    /*Subscribe options Select2*/
    private subscribecreditCard() {
        this.creditCardVar = $('#credit_card').select2({
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange",
            minimumResultsForSearch: Infinity,
            placeholder: "Select Credit Card"
        });
    };
    /*Month Select2*/
    private monthSelect2() {
        this.monthVar = $('#month').select2({
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange",
            minimumResultsForSearch: Infinity,
        });

        this.monthVar.on('change', (e: any) => {
            this.pay.expiry_month = $(e.target).val();
        });
    };
    /*Year Select2*/
    private yearSelect2() {
        this.yearVar = $('#year').select2({
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange",
            minimumResultsForSearch: Infinity,
        });

        this.yearVar.on('change', (e: any) => {
            this.pay.expiry_year = $(e.target).val();
        });
    };

    backToByLicence() {
        this.rhsService.showColumn('buy_licence');
    }

    onSubmit() {
        this.errorMessage = '';
        this.pay.card_number = this.card_number.replace(/\s/g,'');
        switch (true) {
            case !this.isEmpty(this.pay):
                this.errorMessage = 'All field is required';
                break;
            case this.pay.card_number.length != 16:
                this.errorMessage = 'CC number is not correctly';
                break;
            default:
                this.makeRequest();
        }
        this.removeMessage('errorMessage');
    }

    makeRequest() {
        this.globalService.postRquest('/pay',this.pay).subscribe(
            isSuccess => {
                console.log(isSuccess);
            }, error2 => {
                this.errorMessage = error2.messafe;
                this.removeMessage('errorMessage');
            }
        );
    }

    isEmpty(obj) {
        try {
            for(let key in obj) {
                if(!obj[key]) {
                    return false;
                }
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    private plugins() {
        $('input.credit_card_number').formance('format_credit_card_number');
        $('input.credit_card_cvc').formance('format_credit_card_cvc');
        let myInput = document.getElementById('ccnumber');
        myInput.onpaste = function(e) {
            e.preventDefault();
        };
        let cvv = document.getElementById('svv');
        cvv.onpaste = function(e) {
            e.preventDefault();
        };
    }

    removeMessage(filed) {
        setTimeout(() => {
            this[filed] = '';
        }, 5 * 1000);
    }
}