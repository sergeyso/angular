import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {GlobalService} from "../../../services/global.service";
import {ValidationForm} from "../../../helpers/validation";

@Component({
    selector: 'monetization',
    templateUrl: 'monetization-component.html'
})
export class MonetizationComponent implements OnInit{
    frequencymVar:any;
    currencymVar:any;
    addMonetisation: FormGroup;
    submit: boolean = false;

    constructor(
        public globalService: GlobalService,
        private formbuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.frequencymSelect();
        this.currencmySelect();
        this.addMonetisation = this.formbuilder.group({
            video: [JSON.stringify(this.globalService.rightColumnValueFeed)],
            frequency: ['24h'],
            currency: ['eur'],
            amount: ['', Validators.required]
        });
    }
    /* Frequency Select2 */
    private frequencymSelect() {
        this.frequencymVar = $('#frequencym').select2({
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange",
            minimumResultsForSearch: Infinity
        });

        this.frequencymVar.on('change', (e: any) => {
            this.addMonetisation.controls['frequency'].setValue($(e.target).val());
        });
    }

    /* Currency Select2 */
    private currencmySelect() {
        this.currencymVar = $('#currencym').select2({
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange",
            minimumResultsForSearch: Infinity
        });

        this.currencymVar.on('change', (e: any) => {
            this.addMonetisation.controls['frequency'].setValue($(e.target).val());
        });
    }

    addNewMonetisation() {
        this.submit = true;
        ValidationForm.checkValid(this.addMonetisation);
        if(this.addMonetisation.valid) {
            this.globalService.postRquest('/addppvoptions', this.addMonetisation.value).subscribe(
                sucessfully => {
                    this.addMonetisation.reset();
                    this.submit = false;
                    console.log(sucessfully, 'sucessfully');
                }, error => {
                    console.log(error, 'error');
                    this.submit = false;
                }
            )
        }
    }
}