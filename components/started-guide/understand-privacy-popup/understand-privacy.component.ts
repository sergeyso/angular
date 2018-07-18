import {Component, EventEmitter, Output} from '@angular/core';
import {SectorService} from "../../../services/sector.service";
@Component({
    selector: 'popup-understand-privacy',
    templateUrl: 'understand-privacy.html'
})
export class UnderstandPrivacyComponent {
    @Output() closeModal = new EventEmitter<boolean>();
    securityModalStatus: boolean = false;
    constructor(
        public sectorService: SectorService
    ) {}

    hidePopup() {
        this.closeModal.emit(false);
        return false;
    }

    toggleSecurity (status: boolean) {
        this.sectorService.securityModalStatus = status;
        return false;
    }
}
