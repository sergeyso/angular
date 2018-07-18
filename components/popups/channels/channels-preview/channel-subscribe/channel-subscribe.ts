import {Component, AfterViewInit} from '@angular/core';

@Component({
    selector: "channel-subscribe",
    templateUrl: 'channel-subscribe.html'
})
export class ChannelSubscribe implements AfterViewInit{
    creditCardVar:any;
    monthVar:any;
    yearVar:any;
    ngAfterViewInit() {
        this.subscribecreditCard();
        this.monthSelect2();
        this.yearSelect2();
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
    };
    /*Year Select2*/
    private yearSelect2() {
        this.yearVar = $('#year').select2({
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange",
            minimumResultsForSearch: Infinity,
        });
    };
}