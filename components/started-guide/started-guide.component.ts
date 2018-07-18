import {Component} from '@angular/core';
import {SectorService} from "../../services/sector.service";
import {GlobalService} from "../../services/global.service";

@Component({
    selector: 'app-started-guide',
    templateUrl: 'started-guide.html'
})
export class StartedGuideComponent {
    sectors: any = this.sectorService.sectors;
    sectorIndex: number = 0;
    askQuestionPopupStatus: boolean = false;
    chromePluginPopupStatus: boolean = false;
    connectVaultPopupStatus: boolean = false;
    createEventPopupStatus: boolean = false;
    createPostPopupStatus: boolean = false;
    mobileAppsPopupStatus: boolean = false;
    setupChannelsPopupStatus: boolean = false;
    setupFoldersPopupStatus: boolean = false;
    understandPrivacyPopupStatus: boolean = false;
    uploadContentPopupStatus: boolean = false;
    inviteContactsPopupStatus: boolean = false;
    preloadDialogPopupStatus: boolean = false;
    selectedSector: string = 'Other';
    readedTips: any = [];
    step2: boolean = false;
    step3: boolean = false;
    completness: number = 0;
    tipsCount: number = 9;
    isChrome: boolean = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    constructor(private sectorService: SectorService, private global: GlobalService) {
        if (this.isChrome) {
            this.tipsCount = 10;
        }
        if (this.global.login.data.guide_tips) {
            this.readedTips = JSON.parse(this.global.login.data.guide_tips).tips;
            this.selectedSector = JSON.parse(this.global.login.data.guide_tips).sector;
            this.completness = Math.round(this.readedTips.length / this.tipsCount * 100);
        } else {
            this.sectorService.readTips([], this.selectedSector).subscribe();
        }
        if (!this.global.login.data.start_guide) {
            this.step2 = true;
        }
    }

    close() {
        if (this.step2) {
            this.sectorService.startedGuideStatus = false;
        } else {
            this.closeStartedGuide();
            this.step2Show();
        }
        return false;
    }

    closeCompleted() {
        this.sectorService.startedGuideStatus = false;
        return false;
    }

    step2Show() {
        this.step2 = true;
        return false;
    }

    chooseSector(sector: string, index: number) {
        this.selectedSector = sector;
        this.sectorIndex = index;
        return false;
    }

    askQuestionPopupToggle (status: boolean) {
        this.askQuestionPopupStatus = status;
        return false;
    }

    chromePluginPopupToggle (status: boolean) {
        this.chromePluginPopupStatus = status;
        return false;
    }

    connectVaultPopupToggle (status: boolean) {
        this.sectorService.connectVaultTipShow = status;
        this.connectVaultPopupStatus = status;
        return false;
    }

    createEventPopupToggle (status: boolean) {
        this.sectorService.createMeetingTipShow = status;
        this.createEventPopupStatus = status;
        return false;
    }

    createPostPopupToggle (status: boolean) {
        this.createPostPopupStatus = status;
        return false;
    }

    mobileAppsPopupToggle (status: boolean) {
        this.mobileAppsPopupStatus = status;
        return false;
    }

    setupChannelsPopupToggle (status: boolean) {
        this.setupChannelsPopupStatus = status;
        return false;
    }

    setupFoldersPopupToggle (status: boolean) {
        this.sectorService.foldersTipShow = status;
        this.setupFoldersPopupStatus = status;
        return false;
    }

    understandPrivacyPopupToggle (status: boolean) {
        this.understandPrivacyPopupStatus = status;
        return false;
    }

    uploadContentPopupToggle (status: boolean) {
        this.uploadContentPopupStatus = status;
        return false;
    }

    inviteContactsPopupToggle (status: boolean) {
        this.sectorService.inviteTipShow = status;
        this.inviteContactsPopupStatus = status;
        return false;
    }

    preloadDialogPopupToggle (status: boolean) {
        this.preloadDialogPopupStatus = status;
        this.step2Show();
        return false;
    }

    skipStatus(status: boolean) {
        if (status) {
            this.selectedSector = 'Other';
            this.sectorIndex = 0;
        }
    }

    closeStartedGuide () {
        this.sectorService.closeStartedGuide().subscribe(
            (response) => {});
    }

    readTip(tip: string) {
        if (this.readedTips.includes(tip)) {
          return false;
        }
        this.readedTips.push(tip);
        this.global.login.data.guide_tips = JSON.stringify({sector: this.selectedSector, tips: this.readedTips});
        this.sectorService.startedGuideInfo = this.readedTips.length + '/' + this.tipsCount;
        this.completness = Math.round(this.readedTips.length / this.tipsCount * 100);
        if (this.readedTips.length === this.tipsCount) {
            this.step3 = true;
            this.sectorService.showStartedTipsStatus = false;
        }
        this.sectorService.readTips(this.readedTips, this.selectedSector).subscribe(() => {});
        return false;
    }
}
