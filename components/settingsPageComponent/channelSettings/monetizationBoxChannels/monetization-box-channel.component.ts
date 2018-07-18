import {Component, AfterViewInit} from '@angular/core';

@Component({
    selector: 'monetization-box',
    templateUrl: 'monetization-box-channel.html'
})
export class MonetizationBoxChannel implements AfterViewInit{
    frequencyVar:any;
    availableCountry:any;
    currencyVar:any;
    googleVar:any;
    itunesVar:any;

    ngAfterViewInit() {
        this.frequencySelect();
        this.countrySelect();
        this.currencySelect();
        this.googleSelect();
        this.itunesSelect();
    }

    /* Frequency Select2 */
    private frequencySelect() {
        this.frequencyVar = $('#frequency').select2({
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange",
            minimumResultsForSearch: Infinity
        });
    }

    /* Country Select2*/
    private countrySelect() {
        this.availableCountry = $('#countrym').select2({
            multiple: true,
            minimumInputLength: 3,
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange"
        })
    }

    /* Currency Select2 */
    private currencySelect() {
        this.currencyVar = $('#currency').select2({
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange",
            minimumResultsForSearch: Infinity
        });
    }

    /* Google Select2 */
    private googleSelect() {
        this.googleVar = $('#googleselect').select2({
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange",
            minimumResultsForSearch: Infinity
        });
    }

    /* Currency Select2 */
    private itunesSelect() {
        this.itunesVar = $('#itunesselect').select2({
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange",
            minimumResultsForSearch: Infinity
        });
    }

}