import {Component, OnInit} from '@angular/core';
import {VaultService} from "../../../services/vault.service";
import * as moment from 'moment';

@Component({
    selector: 'header-app',
    templateUrl: 'vault-header.html',
})
export class VaultHeaderComponent implements OnInit {
    last_sync: string = '';
    constructor(public vaultService: VaultService) {}

    ngOnInit () {}

    lastSync () {
        return moment(this.vaultService.dropboxSettings.last_sync * 1000).fromNow();
    }

    openFolder(folder: any) {
        const index = this.vaultService.path.findIndex(
            (el) => {
                return el.id === folder.id;
            }
        );
        this.vaultService.path.splice(index + 1);
        this.vaultService.getFolderContent(folder.id);
        return false;
    }

    sync() {
        this.vaultService.syncronization = true;
        this.vaultService.syncDropbox();
        return false;
    }
}
