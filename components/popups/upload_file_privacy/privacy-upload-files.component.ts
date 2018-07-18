import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GlobalService} from "../../../services/global.service";
import {FolderService} from "../../../services/folder.service";
declare let $: any;

@Component({
    selector: 'privacy-upload-files',
    templateUrl: 'privacy-upload-files.html'
})
export class PrivacyUploadFiles implements AfterViewInit, OnInit {

    @Output() hidePopupEmit = new EventEmitter();
    @Input('file') file:any;
    privacyVar: any;
    showPin: string = '';
    privacyArray: any;

    constructor(
        public globalService: GlobalService,
        public folderService: FolderService
    ) {}

    ngOnInit() {
        this.showPin = this.file.privacy.name;
    }

    ngAfterViewInit() {
        this.privacySelect();
        this.privacySelectChange();
    }

    hidePopup() {
        this.hidePopupEmit.emit(false);
    }

    /*Privay Select2*/
    private privacySelect() {
        this.privacyVar = $('#privacy').select2({
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange privacy-select-dropdown",
            minimumResultsForSearch: Infinity
        });
    }

    /*Privay Select2*/
    private privacySelectChange() {
        this.privacyVar.on('change', (e: any) => {
            this.showPin = $(e.target).val();
            if($(e.target).val() == 'Public') {
                this.privacyArray = ["read"]
            } else {
                this.privacyArray = []
            }
        });
    }

    savePrivacy() {
        this.file.privacy.name = this.showPin;
        this.file.privacy.selected = this.privacyArray;
        this.hidePopupEmit.emit(false);
    }

}