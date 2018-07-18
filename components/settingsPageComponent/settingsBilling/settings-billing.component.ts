import {AfterViewInit, Component} from '@angular/core';
import {GlobalService} from "../../../services/global.service";
import {ResponseApi} from '../../../models/interfaces/responseApi.interface';
import {NgForm} from '@angular/forms';
import {ValidationForm} from '../../../helpers/validation';
import {SettingsService} from "../../../services/settings.service";
import {Http, Response} from '@angular/http';
import {isNumber} from "util";

@Component({
    selector: 'billing',
    templateUrl: 'settings-billing.html'
})
export class BillingSettings implements AfterViewInit {
    seatsFormVisible: boolean = false;
    changePackagesFormVisible: boolean = false;
    paymentFormVisible: boolean = false;
    messageFormVisible: boolean = false;
    packages: Array<any>;
    packagesVar: any;
    newUsers: string = '';
    disable: boolean = false;
    countSeats: any = 1;
    pricePerOne: number = 10;
    totalPrice: number = this.countSeats * this.pricePerOne;
    loading: boolean = false;
    seatsUsers: any = [];
    currentPackage: any = {};
    packagesList: any = [];
    buySeatsDisabled: boolean = false;
    buySeatsError: string = '';

    constructor(public globalService: GlobalService,
                private settingsService: SettingsService) {
        this.getInvitesUsers();
        this.getCurrentPackage();
    }

    ngAfterViewInit() {
        this.packagesSelect();
    }

    getInvitesUsers() {
        this.settingsService.getCompanyInvites()
            .subscribe(
                (response: Response) => {
                    this.seatsUsers = response.json().response_data;
                }
            );
        this.checkSeatsCount();
    }

    getCurrentPackage() {
        this.currentPackage = this.settingsService.currentPackage;
        this.pricePerOne = this.currentPackage.package.user_fee / 100;
        this.calculateTotalPrice();
        this.checkSeatsCount();
    }

    checkSeatsCount() {
        if (this.currentPackage.seats === this.seatsUsers.length) {
            this.disable = true;
        } else {
            this.disable = false;
        }
    }

    buySeats() {
        this.loading = true;
        this.settingsService.buySeats({count: this.countSeats})
            .subscribe((response: Response) => {
                    this.loading = false;
                    this.seatsFormVisible = false;
                    this.getCurrentPackage();
                },
                (response: Response) => {
                    this.buySeatsError = response.json().response_data;
                    setTimeout(() => {
                        this.buySeatsError = '';
                    }, 3000);
                }
            );
        return false;
    }

    //Calculate seats total price
    calculateTotalPrice() {
        this.countSeats = isNumber(this.countSeats) ? Math.round(this.countSeats) : '';
        if (!this.countSeats || this.countSeats < 1) {
            this.buySeatsDisabled = true;
        } else {
            this.buySeatsDisabled = false;
            this.totalPrice = this.countSeats * this.pricePerOne;
        }
    }

    // Open seats form
    openPopupForm(value) {
        switch (value) {
            case 'seats':
                this.seatsFormVisible = true;
                break;
            case 'packages':
                this.changePackagesFormVisible = true;
                this.packagesSelect();
                break;
            case 'payment':
                this.paymentFormVisible = true;
                break;
            case 'message':
                this.messageFormVisible = true;
                break;
        }
    }

    //Hide popups
    hidePopup(value) {
        switch (value) {
            case 'seats':
                this.seatsFormVisible = false;
                break;
            case 'packages':
                this.changePackagesFormVisible = false;
                break;
            case 'payment':
                this.paymentFormVisible = false;
                break;
            case 'message':
                this.messageFormVisible = false;
                break;
        }

    }

    /*Select2 configuration*/
    packagesSelect() {
        this.packagesVar = $('#packages').select2({
            data: this.packages,
            minimumResultsForSearch: -1
        });
    }

    getEmptySeats() {
        const emptySeats = [];
        for (let i = 1; i <= (this.currentPackage.seats - this.seatsUsers.length); i++) {
            emptySeats.push(i);
        }
        return emptySeats;
    }

    protected deleteInvitedUser(user) {
        this.globalService.deleteRquest(`${this.globalService.apiUrl}invites/${user.id}`).subscribe(success => {
            this.getInvitesUsers();
        });
    }

    invitedNewContact(form: NgForm) {
        ValidationForm.checkValid(form);
        if (form.valid) {
            this.disable = true;
            const object = {
                'email': this.newUsers, // newuser is array of emails
            };
            this.globalService.postRquest(this.globalService.apiUrl + 'companies/invite-user', object)
                .subscribe(
                    (success: ResponseApi) => {
                        this.getInvitesUsers();
                    }, error2 => {
                        this.newUsers = '';
                        this.disable = false;
                        form.reset();
                    }, () => {
                        form.reset();
                        this.newUsers = '';
                        this.disable = false;
                    }
                );
        }
    }
}