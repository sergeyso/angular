import {Component, EventEmitter, Output} from '@angular/core';
import {VaultService} from "../../../services/vault.service";
import {GlobalService} from "../../../services/global.service";

@Component({
    selector: 'connect-vault',
    templateUrl: 'connect-vault.html'
})
export class ConnectVaultPopupComponent {
    constructor(
        public vaultService: VaultService,
        private globalService: GlobalService
    ) {}

    hidePopup() {
        this.vaultService.connectVaultPopupStatus = false;
        return false;
    }

    dropBoxClick() {
        if (this.vaultService.dropboxConnection) {
            window.location.href = '/vault';
        } else {
            const token = this.globalService.createAuthorizationToken();
            window.location.href = 'https://dropbox.knowlocker.com/call-dropbox?token=' + token;
        }
    }

    toggleVaultPopup(status: boolean) {
        this.vaultService.vaultPopupVisible = status;
    }
}
