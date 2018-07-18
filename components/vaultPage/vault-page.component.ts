import {Component, HostListener, OnInit} from '@angular/core';
import {GlobalService} from "../../services/global.service";
import {VaultService} from "../../services/vault.service";
import {PerfectScrollbarConfig} from "ngx-perfect-scrollbar";

@Component({
    selector: 'app-vault',
    templateUrl: 'vault-page.html'
})
export class VaultPageComponent implements OnInit {
    shareFolderPopupStatus: boolean = false;
    scrollHeight: number = window.innerHeight;
    timeout: boolean = false;
    fileProcessingPopupStatus: boolean = false;
    config = new PerfectScrollbarConfig({
        suppressScrollX: true,
    });

    constructor(public global: GlobalService,
                public vaultService: VaultService) {
    }

    ngOnInit() {

    }
    @HostListener('window:resize', ['$event'])
    onWindowResize(event) {
        this.scrollHeight = event.target.innerHeight;
    };

    toggleFileProcessingPopup (status: boolean) {
        this.fileProcessingPopupStatus = status;
    }

    getFileHref (file: any) {
        if (Object.keys(file.previewdata).length === 0) {
            return '';
        } else {
            return file.short_url;
        }
    }

    openSubfolder(folder: any) {
        this.vaultService.path.push({name: folder.name, id: folder.id});
        this.vaultService.getFolderContent(folder.id);
    }

    openFile(file: any) {
        if (Object.keys(file.previewdata).length === 0) {
            this.toggleFileProcessingPopup(true);
            return false;
        }
    }

    shareFolder(folder: any) {
        this.global.folderObject = {folder: folder};
        this.toggleShareFolder(true);
        return false;
    }

    toggleShareFolder(status: boolean) {
        this.shareFolderPopupStatus = status;
        return false;
    }

    onScrollContent() {
        if (this.timeout) {
            return;
        }
        this.vaultService.onscrollLoading = true;
        this.timeout = true;
        this.vaultService.getFolderContentOnScroll();
        setTimeout(() => {
            this.timeout = false;
        }, 2000)
    }
}
