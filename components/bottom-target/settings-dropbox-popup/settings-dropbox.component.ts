import {Component, OnInit} from '@angular/core';
import {VaultService} from "../../../services/vault.service";


@Component({
    selector: 'popup-settings-dropbox',
    templateUrl: 'settings-dropbox.html'
})
export class SettingsDropboxPopupComponent implements OnInit {
    activeTab: number = 1;
    syncParameter: string = 'all';
    foldersToSync: any = [];
    inherit_sharing: boolean;

    constructor(public vaultService: VaultService) {
        this.getFolders();
        this.syncParameter = this.vaultService.dropboxSettings.full ? 'all' : 'folders';
    }

    ngOnInit() {
        this.foldersToSync = this.vaultService.dropboxSettings.folderIds;
        this.inherit_sharing = this.vaultService.dropboxSettings.inherit_sharing;
    }

    hidePopup() {
        this.vaultService.settingsDropboxStatus = false;
        return false;
    }

    selectTab(index: number) {
        this.activeTab = index;
        return false;
    }

    disconnectDropbox() {
        this.vaultService.disconnectDropbox();
        this.hidePopup();
        return false;
    }

    saveSettings() {
        this.vaultService.syncronization = true;
        let data = {};
        if (this.syncParameter === 'all') {
            data = {
                full: true,
                inherit_sharing: this.inherit_sharing
            }
        } else {
            data = {
                full: false,
                folderIds: this.foldersToSync,
                folders: this.vaultService.dropboxSettingsFolders,
                inherit_sharing: this.inherit_sharing
            }
        }
        this.vaultService.saveDropboxSettings(data);
        setTimeout(() => {
            this.hidePopup();
        }, 3000);
        return false;
    }

    getFolders() {
        this.vaultService.getDropboxSettingsFolders();
    }

    addFolderToSync(index: number) {
        this.vaultService.dropboxSettingsFolders[index].checked = !this.vaultService.dropboxSettingsFolders[index].checked;
        const id = this.vaultService.dropboxSettingsFolders[index].path_lower;
        const i = this.foldersToSync.indexOf(id);
        if (i === -1) {
            this.foldersToSync.push(id);
        } else {
            this.foldersToSync.splice(i, 1);
        }
    }
}
