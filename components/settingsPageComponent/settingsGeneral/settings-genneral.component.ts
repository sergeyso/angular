import {Component, AfterViewInit, ViewChild, NgZone, AfterContentChecked} from '@angular/core';
import {GlobalService} from "../../../services/global.service";
import {ValidationForm} from "../../../helpers/validation";
import {NgForm} from "@angular/forms";
import {GeneralSettingsModels} from "../../../models/class/settings/general.model";
import {FacebookService} from "../../../services/facebook.service";
import {error} from "util";

@Component({
    selector: 'generalsettings',
    templateUrl: 'settings-general.html'
})
export class SettingsGeneral implements AfterViewInit, AfterContentChecked {
    facebook:boolean = false;
    acceptFilesVar:any;
    @ViewChild('generalSettings') generalSettings: NgForm;
    general: GeneralSettingsModels = new GeneralSettingsModels();
    generalChanges: any;
    @ViewChild('information') information: NgForm;
    errorMessageInformation:any = '';
    confirmMessageInformation:any = '';

    constructor(
        public global: GlobalService,
        public lc: NgZone
    ) {}

    ngAfterViewInit() {
        this.acceptFiles();
/*        this.facebookService.connectSdkFacebook();*/
    }

    ngAfterContentChecked() {
        if(this.generalChanges != JSON.stringify(this.general)) {
            this.generalChanges = JSON.stringify(this.general);
            this.errorMessageInformation = '';
            this.confirmMessageInformation = '';
        }
    }

    /*Folder Select2*/
    private acceptFiles() {
        this.acceptFilesVar = $('#accept-files').select2({
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange",
            minimumResultsForSearch: Infinity
        });
    }

    onSubmitGeneral() {
        try {
            ValidationForm.checkValid(this.generalSettings);
            if (this.generalSettings.valid) {
                this.updateGeneralFunction();
            }
        } catch (e) {
            document.location.href="/settings";
        }
    }

    onSubmitInformation() {
        try {
            this.global.postRquest(this.global.apiUrl+'users/self', this.general).subscribe(
                (successfully: Response) => {
                    this.confirmMessageInformation = 'Successfully update user information';
                    this.setTimeoutMessage('confirmMessageInformation');
                }, error => {
                    this.errorMessageInformation = error;
                    this.setTimeoutMessage('errorMessageInformation');
                    this.global.loadingRequest = false;
                }, () => {
                    this.global.loadingRequest = false;
                }
            );
        } catch (e) {
            document.location.href="/settings";
        }
    }

    private setTimeoutMessage(message) {
        setTimeout(() => {
            this[message] = ''
        }, 5 * 1000);
    }

    private updateGeneralFunction() {

    }
}