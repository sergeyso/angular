import {AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
import {GlobalService} from "../../services/global.service";
import {SectorService} from "../../services/sector.service";
import {VaultService} from "../../services/vault.service";

@Component({
    selector: 'vault-column',
    templateUrl: 'vault-column.html',
})
export class VaultColumnComponent {
    @ViewChild('mainBox') mainBox: ViewChild;
    constructor(
        public globalService: GlobalService,
        public sectorService: SectorService,
        public vaultService: VaultService
    ) {}

    dropBoxClick() {
        if (this.vaultService.dropboxConnection) {
            this.vaultService.settingsDropboxStatus = true;
        } else {
            this.toggleConnectVaultPopup(true);
        }
    }

    toggleVaultPopup(status: boolean) {
        this.vaultService.vaultPopupVisible = status;
    }

    toggleConnectVaultPopup (status: boolean) {
        this.vaultService.connectVaultPopupStatus = status;
        return false;
    }


}
