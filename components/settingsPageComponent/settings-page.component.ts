import {Component} from '@angular/core';
import {GlobalService} from "../../services/global.service";
import {VaultService} from "../../services/vault.service";
import {SettingsService} from "../../services/settings.service";

@Component({
    templateUrl: 'settings-page.html'
})
export class SettingsPage {
    selected: string = this.globalService.selectedSettingsTab;
    user: any;

    constructor(public globalService: GlobalService,
                public vaultService: VaultService,
                public settingsService: SettingsService) {
        this.user = this.globalService.login.data;
    }
}
