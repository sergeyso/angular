import {Component, OnInit} from '@angular/core';
import {VaultService} from "../../../services/vault.service";

@Component({
    selector: 'popup-vault-modal',
    templateUrl: 'vault-modal.html'
})
export class VaultModalComponent {
    constructor(
        private vaultService: VaultService
    ) {}

    close() {
        this.vaultService.vaultPopupVisible = false;
        return false;
    }
}
