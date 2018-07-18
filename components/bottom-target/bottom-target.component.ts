import {Component, HostListener, ViewChild} from '@angular/core';
import {GlobalService} from '../../services/global.service';
import {FolderService} from '../../services/folder.service';
import {SectorService} from "../../services/sector.service";
import {VaultService} from "../../services/vault.service";

@Component({
    selector: 'bottom-target',
    templateUrl: 'bottom-target.html',
})
export class BottomTargetComponent {
    answer: string = '';
    postUploadForm: boolean = false;
    postFileUploadForm: boolean = false;
    liveSetupForm: boolean = false;
    askQuestionForm: boolean = false;
    addAnswerFiles: boolean = false;
    defaultBottomTarget: boolean = true;
    freeAccountPopup: boolean = false;
    uploadedImage: string = '';
    recordTargetCont: boolean = false;
    vaultTargetCont: boolean = false;
    zindexValue: number = 100;
    audioPopupVisible: boolean = false;
    videoPopupVisible: boolean = false;
    screenPopupVisible: boolean = false;
    recFile: any = null;
    addProcessStatus: boolean = false;
    @ViewChild('openRecord') openRecord;
    @ViewChild('openVault') openVault;

    constructor(public global: GlobalService,
                public folderService: FolderService,
                public sectorService: SectorService,
                public vaultService: VaultService) {
        if ((!this.global.login.data.guide_tips || JSON.parse(this.global.login.data.guide_tips).tips.length !== 10) && this.global.login.data.company_owner !== 0) {
            this.sectorService.showStartedTipsStatus = true;
            this.sectorService.startedGuideStatus = true;
        }

        this.global.openFileUploadForm.subscribe((value) => {
            this.toggleFilePostForm(value);
        });
    }

    dropBoxClick() {
        if (this.vaultService.dropboxConnection) {
            window.location.href = '/vault';
        } else {
            window.location.href = '/settings?target=integrations';
        }
    }

    // Open Post create form
    togglePostForm(status: boolean) {
        this.postUploadForm = status;
        this.defaultBottomTarget = !status;
    }

    toggleFilePostForm (status: boolean) {
        this.postFileUploadForm = status;
        this.defaultBottomTarget = !status;
    }

    // Open Live Setup Form
    openLiveSetupForm() {
        this.global.liveEditObject = null;
        this.global.liveSetupForm = true;
        this.defaultBottomTarget = false;
    }

    // Close Live setup popup
    hideLiveSetupPopup(event) {
        this.global.liveSetupForm = event;
        this.global.liveEditObject = null;
        this.defaultBottomTarget = true;
    }

    // Open Ask question form
    openAskQuestionForm() {
        this.askQuestionForm = true;
    }

    // Close Ask question popup
    hideAskQuestionPopup(event) {
        this.askQuestionForm = event;
        this.defaultBottomTarget = true;
    }

    // Open Add AnswerFiles
    openAddAnswerFilesForm() {
        this.addAnswerFiles = true;
    }

    // Close Add AnswerFiles
    hideaddAnswerFiles(event) {
        this.addAnswerFiles = event;
        this.defaultBottomTarget = true;
        this.global.showAnswerBottomVar = false;
    }

    closeAddAnswerForm(event) {
        this.global.question = null;
        this.global.showAnswerBottomVar = event;
    }

    /**
     * Open Record Target container
     */
    openRecordTarget() {
        this.recordTargetCont = !this.recordTargetCont;
    }

    /**
     * Open Vault Target container
     */
    openVaultTarget() {
        this.vaultTargetCont = !this.vaultTargetCont;
    }

    /**
     * Change z-index on container
     */
    changeZindex(value) {
        this.zindexValue = value;
    }

    /**
     * Open record audio popup
     */
    openRecordAudio() {
        this.audioPopupVisible = true;
        this.recordTargetCont = false;
    }

    hideRecordAudio(value) {
        this.audioPopupVisible = value.isOpen;

        if (value.file != null) {
            this.recFile = value.file;
            this.toggleFilePostForm(true);
        }
    }

    /**
     * Open record audio popup
     */
    openRecordVideo() {
        this.videoPopupVisible = true;
        this.recordTargetCont = false;
    }

    /**
     * Open record screen popup
     */
    openRecordScreen() {
        this.recordTargetCont = false;
        this.screenPopupVisible = true;
    }

    /**
     * Hide record video
     */
    hideRecordVideo(value) {
        this.videoPopupVisible = value.isOpen;

        if (value.file != null) {
            this.recFile = value.file;
            this.toggleFilePostForm(true);
        }
    }

    /**
     * Hide record screen
     */
    hideRecordScreen(value) {
        this.screenPopupVisible = value.isOpen;

        if (value.file != null) {
            this.recFile = value.file;
            this.toggleFilePostForm(true);
        }
    }
    /**
     * clicking outside container to close it
     */
    @HostListener('document:click', ['$event'])
    clickout(event) {
        if (this.openRecord && !this.openRecord.nativeElement.contains(event.target)) {
            this.openRecordClick(event);
        }
        if (this.openVault && !this.openVault.nativeElement.contains(event.target)) {
            this.openVaultClick(event);
        }
    }

    /**
     * Click Private Channel
     * @param event
     */
    private openRecordClick(event): void {
        if (!this.openRecord.nativeElement.contains(event.target)) {
            this.recordTargetCont = false;
        }
    }
    /**
     * Click Private Channel
     * @param event
     */
    private openVaultClick(event): void {
        if (!this.openVault.nativeElement.contains(event.target)) {
            this.vaultTargetCont = false;
        }
    }

    toggleStartedGuide() {
        this.sectorService.startedGuideStatus = !this.sectorService.startedGuideStatus;
    }

    toggleAddProcess (status: boolean) {
        this.addProcessStatus = status;
        return false;
    }
}
