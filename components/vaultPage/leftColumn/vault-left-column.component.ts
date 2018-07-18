import {Component, Input, OnChanges} from '@angular/core';
import {GlobalService} from "../../../services/global.service";
import {VaultService} from "../../../services/vault.service";

@Component({
    selector: 'app-vault-left-column',
    templateUrl: 'vault-left-column.html'
})
export class VaultLeftColumnComponent implements OnChanges {
    @Input() isSettingsLoaded: boolean = false;
    constructor(
        public global: GlobalService,
        public vaultService: VaultService
    ) {}

    ngOnChanges() {
        if (this.isSettingsLoaded) {
            this.vaultService.getDropbox();
        }
    }
}
