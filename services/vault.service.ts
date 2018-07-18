import {Injectable} from "@angular/core";
import {GlobalService} from "./global.service";
import {Http, Response} from "@angular/http";
import {Observable} from 'rxjs/Observable';

@Injectable()
export class VaultService {
    private url = this.globalService.apiUrl;
    folders: any = [];
    activeFolder: number = 0;
    subfolders: any = [];
    folderFiles: any = [];
    loading: boolean = false;
    path: any = [];
    dropboxConnection: boolean = false;
    dropboxAccount: string = 'Dropbox';
    syncronization: boolean = false;
    dropboxSettings: any = {};
    rootFolder: number = null;
    dropboxSettingsFolders: any = [];
    onscrollLoading: boolean = false;
    folderFilesPage: number = 1;
    vaultPopupVisible: boolean = false;
    connectVaultPopupStatus: boolean = false;
    settingsDropboxStatus: boolean = false;
    settingsLoaded: boolean = false;
    constructor(private globalService: GlobalService,
                private http: Http) {
        this.checkDropboxConnection();
        this.getDropboxSettings();
    }

    getDropbox() {
        this.loading = true;
        const headers = this.globalService.createAuthorizationHeader();
        this.http.get(this.url + 'folders/tree?filter[root_folder]=' + this.rootFolder + '&filter[is_dropbox]=1', {
            headers: headers,
        }).subscribe(
            (response: Response) => {
                this.loading = false;
                this.syncronization = false;
                this.folders = response.json().response_data;
            }
        )
    }

    getFolderContent(id: number) {
        this.folderFilesPage = 1;
        this.loading = true;
        let secondLoading = true;
        this.activeFolder = id;
        const headers = this.globalService.createAuthorizationHeader();
        this.http.get(this.url + 'folders/' + id, {
            headers: headers,
        }).subscribe(
            (response: Response) => {
                this.loading = secondLoading ? true : false;
                secondLoading = false;
                this.subfolders = response.json().response_data;
            }
        );
        this.http.get(this.url + 'files/search?filter[folder_id][]=' + id + '&filter[is_dropbox]=1&per-page=60', {
            headers: headers,
        }).subscribe(
            (response: Response) => {
                this.loading = secondLoading ? true : false;
                secondLoading = false;
                this.folderFiles = response.json().response_data;
            }
        );
        return false;
    }

    getFolderContentOnScroll() {
        this.folderFilesPage++;
        const headers = this.globalService.createAuthorizationHeader();
        this.http.get(this.url + 'files/search?filter[folder_id][]=' + this.activeFolder + '&filter[is_dropbox]=1&per-page=60&page=' + this.folderFilesPage, {
            headers: headers,
        }).subscribe(
            (response: Response) => {
                this.onscrollLoading = false;
                this.folderFiles.push(...response.json().response_data);
            },
            () => {
                this.folderFilesPage--;
                this.onscrollLoading = false;
            }
        );
    }

    checkDropboxConnection() {
        this.http.get('https://dropbox.knowlocker.com/dropbox/checkConnection/' + this.globalService.login.data.id).subscribe(
            (response: Response) => {
                this.dropboxConnection = response.json().data.db_connectivity;
            }
        )
    }

    disconnectDropbox() {
        this.http.get('https://dropbox.knowlocker.com/dropbox/disconnect/' + this.globalService.login.data.id).subscribe(
            (response: Response) => {
                this.dropboxConnection = false;
            }
        )
    }

    syncDropbox() {
        this.syncronization = true;
        setTimeout(() => {
            this.syncronization = false;
        }, 3000);
        this.http.get('https://dropbox.knowlocker.com/syncFolders/' + this.globalService.login.data.id).subscribe(
            (response: Response) => {
                this.getDropbox();
                this.getDropboxSettings();
            }
        )
    }

    getDropboxSettingsFolders() {
        this.http.get('https://dropbox.knowlocker.com/dropbox/getFolders/' + this.globalService.login.data.id).subscribe(
            (response: Response) => {
                this.dropboxSettingsFolders = response.json().data.folders;
            }
        )
    }

    getDropboxSettings() {
        this.http.get('https://dropbox.knowlocker.com/settings/' + this.globalService.login.data.id).subscribe(
            (response: Response) => {
                this.dropboxSettings = response.json().data;
                this.dropboxAccount = this.dropboxSettings.account;
                this.rootFolder = response.json().data.root_folder;
                this.settingsLoaded = true;
            }
        )
    }

    saveDropboxSettings(data: any) {
        this.http.post('https://dropbox.knowlocker.com/settings/' + this.globalService.login.data.id,
            data
        ).subscribe(
            (response: Response) => {
                this.dropboxSettings = response.json().data;
                this.syncronization = false;
                this.syncDropbox();
            }
        )
    }
}
