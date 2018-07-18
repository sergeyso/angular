import {Component, OnInit} from '@angular/core';
import {RshService} from "../../../../services/rsh.service";
import {GlobalService} from "../../../../services/global.service";
import {LicenceFile} from "../../../../models/class/licenceFileOption/licence-File.model";
import {Amount} from "../../../../models/class/licenceFileOption/amount";
import {Checkbox} from "../../../../models/class/licenceFileOption/checkbox";
import {LicenceService} from "../../../../services/licence.service";

@Component({
    selector: 'add-licence',
    templateUrl: 'addLicence-component.html'
})
export class AddLicenceComponent implements OnInit{

    test:boolean = true;
    licence:LicenceFile = new LicenceFile();
    submit: boolean = false;
    loading:boolean = true;
    constructor(
        public globalService: GlobalService,
        public rhsService: RshService,
        public licenceService: LicenceService,
    ) {}

    ngOnInit() {
        this.licenceService.licenceFile = [];
        this.licenceService.checkbox = new Checkbox();
        this.licenceService.amount = new Amount();
        this.licenceService.getLicence().then(
            isSuccess => {
                this.loading = false;
            }, error => {
                this.loading = false;
            }
        );
    }

    onSubmit() {
        try {
            let object = {
                token: this.globalService.login.data.fl_token,
                options: this.makeParams(),
                file: JSON.stringify(this.globalService.rightColumnValueFeed)
            };
            this.submit = true;
            this.addLicencingOption(object);
        } catch (e) {
            this.submit = false;
            console.error(e);
        }
    }

    makeParams() {
        let array = [];
        for (let prop in this.licenceService.checkbox) {
            if(this.licenceService.checkbox[prop] && parseFloat(this.licenceService.amount[prop]) > 0) {
                let object = this.checkIfNotNeedSize(
                    {
                        label: this.labelLicence(prop),
/*                        size: this.licenceService.size[prop],*/
                        size: '100',
                        currency: 'EUR',
                        amount: this.licenceService.amount[prop]
                    }
                );
                array.push(object)
            }
        }
        return array;
    }

    checkIfNotNeedSize(object) {
        switch (object.label) {
            case'Unlimited Print':
                delete object.size;
                break;
            case'Product for Resale':
                delete object.size;
                break;
            case'Market Freeze':
                delete object.size;
                break;
        }

        return object
    }

    private labelLicence(prop) {
        let label:string;
        switch (prop) {
            case'small':
                label = "Small";
                break;
            case'medium':
                label = "Medium";
                break;
            case'large':
                label = "Large";
                break;
            case'xLarge':
                label = "X-Large";
                break;
            case'unlimited':
                label = "Unlimited Print";
                break;
            case'resale':
                label = "Product for Resale";
                break;
            case'market':
                label = "Market Freeze";
                break;
        }

        return label
    }

    addLicencingOption(object) {
        this.globalService.postRquest('/updatelicensingoptions', object).subscribe(
            sucessfully => {
                this.licenceService.checkbox = new Checkbox();
                this.licenceService.amount = new Amount();
                object.options.forEach(value => {
                    this.licenceService.checkbox[this.licenceService.labelLicenceDatabase(value.label)] = true;
                    this.licenceService.amount[this.licenceService.labelLicenceDatabase(value.label)] = value.amount;
                });
                this.submit = false;
            }, error => {
                this.submit = false;
                console.log(error, 'error');
            }
        )
    }

    validateNumber(evt) {
        let charCode = (evt.which) ? evt.which : evt.keyCode;
        let number = evt.target.value.split('.');
        if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        //just one dot
        if(number.length>1 && charCode == 46){
            return false;
        }
        //get the carat position
        let caratPos = getSelectionStart(evt.target);
        let dotPos =  evt.target.value.indexOf(".");
        if( caratPos > dotPos && dotPos>-1 && (number[1].length > 1)){
            return false;
        }
        return true;


        //thanks: http://javascript.nwbox.com/cursor_position/
        function getSelectionStart(o) {
            if (o.createTextRange) {
                let document2: any = document;
                let r: any = document2.selection.createRange().duplicate();
                r.moveEnd('character', o.value.length);
                if (r.text == '') return o.value.length;
                return o.value.lastIndexOf(r.text)
            } else return o.selectionStart
        }
    }
}