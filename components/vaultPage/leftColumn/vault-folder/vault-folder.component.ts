import {Component, Input, OnInit} from '@angular/core';
import {GlobalService} from "../../../../services/global.service";
import {VaultService} from "../../../../services/vault.service";

@Component({
    selector: 'app-vault-folder',
    templateUrl: 'vault-folder.html'
})
export class VaultFolderComponent implements OnInit {
    @Input() folder;
    @Input() path = [];
    newPath = [];
    isOpen: boolean = false;
    constructor(
        public global: GlobalService,
        public vaultService: VaultService
    ) {}

    ngOnInit () {
        this.newPath.push(...this.path, {name: this.folder.folder.name, id: this.folder.folder.id});
    }

    toggleFolder() {
        this.isOpen = !this.isOpen;
        return false;
    }

    openFolder(id: number) {
        this.vaultService.path = this.newPath.slice();
        this.vaultService.getFolderContent(id);
        return false;
    }

}
