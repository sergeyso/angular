/**
 * Created by toni on 4.2.17.
 */
import {Injectable}    from '@angular/core';
import {GlobalService} from "./global.service";
import {Checkbox} from "../models/class/licenceFileOption/checkbox";
import {Amount} from "../models/class/licenceFileOption/amount";
import {Size} from "../models/class/licenceFileOption/size";

@Injectable()
export class LicenceService {
    constructor (
        public globalService: GlobalService
    ) {}

    checkbox: Checkbox = new Checkbox();
    amount: Amount = new Amount();
    loaded: boolean = false;
    size: Size = new Size();
    licenceFile: Array<any> = [];
    id: string;
    byLicenceIds: Array<number> = [];

    price: number = 0;

    checkboxBuyLicencing = {
        'Small': false,
        'Medium': false,
        'Large': false,
        'X-Large': false,
        'Unlimited Print': false,
        'Product for Resale': false,
        'Market Freeze': false,
    };

    public getLicence() {
        return new Promise((resolve, reject) => {
            this.globalService.postRquest(`${window['framelocker']}/getvideoprice`, {
                video_id: this.globalService.rightColumnValueFeed.id
            }).subscribe(
                isSuccess => {
                    try {
                        if(isSuccess.status == 1) {
                            this.checkedFromDatabase(isSuccess.licensing_options);
                            resolve(isSuccess);
                        } else {
                            reject(isSuccess);
                        }
                    } catch (e) {
                        reject(e)
                    }
                    this.loaded = true;
                }, error => {
                    this.loaded = true;
                    reject(error)
                }
            )
        });
    }

    checkedFromDatabase(licencing) {
        licencing.forEach(value => {
            this.checkbox[this.labelLicenceDatabase(value.label)] = true;
            this.amount[this.labelLicenceDatabase(value.label)] = value.amount;
        })
    }

    labelLicenceDatabase(prop) {
        let label:string;
        switch (prop) {
            case'Small':
                label = "small";
                break;
            case'Medium':
                label = "medium";
                break;
            case'Large':
                label = "large";
                break;
            case'X-Large':
                label = "xLarge";
                break;
            case'Unlimited Print':
                label = "unlimited";
                break;
            case'Product for Resale':
                label = "resale";
                break;
            case'Market Freeze':
                label = "market";
                break;
        }

        return label;
    }

    changeCheckBox(item) {
        this.checkboxBuyLicencing[item.label] = !this.checkboxBuyLicencing[item.label];
        this.price = 0;
        this.byLicenceIds = [];
        this.licenceFile.forEach(value => {
            if(this.checkboxBuyLicencing[value.label]) {
                this.price = this.price + parseFloat(value.amount);
            }
        });
    }
}