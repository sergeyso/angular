import {Component} from '@angular/core';
import {GlobalService} from "../../../services/global.service";
import {VaultService} from "../../../services/vault.service";

@Component({
    selector: 'integrations',
    templateUrl: 'settings-integrations.html'
})
export class IntegrationsSettingsComponent  {
    settingsDropboxStatus: boolean = false;
    constructor (
        private globalService: GlobalService,
        public  vaultService: VaultService
    ) {}

    connectDropbox () {
        const token = this.globalService.createAuthorizationToken();
        window.location.href = "https://dropbox.knowlocker.com/call-dropbox?token=" + token;
        return false;
    }

    settingsDropboxToggle (status: boolean) {
        this.settingsDropboxStatus = status;
        return false;
    }
}
