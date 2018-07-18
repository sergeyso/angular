import {Component} from '@angular/core';
import {GlobalService} from "../../../services/global.service";


@Component({
    selector: 'left-first-column',
    templateUrl: 'left-first-column.html'
})
export class LeftFirstColumn {
    showEmbedForm:boolean = false;
    showingestTypeManage:boolean = false;
    showGetAppsForm:boolean = false;
    leftColumnBiggerIndex = false;
    notificationShortenContainer = false;
    notificationShortenContainerPersonal = false;
    notificationShortenContainerOrganization = false;
    addNewAccountVisible: boolean = false;
    constructor(public global: GlobalService) {}

    showSecondColumn() {
        this.global.secondColumnvisible = !this.global.secondColumnvisible;
        if (window.innerWidth < 1100) {
            window.scrollTo(0, 0);
        }
    };

    // Open upload form
    openUploadForm () {
        this.global.toggleFileUploadForm();
    }

    //Open ingest type component
    openIngestType() {
        this.showingestTypeManage = !this.showingestTypeManage;
    }

    //Open Show embed form component
    openShowEmbedForm() {
        this.showEmbedForm = !this.showEmbedForm;
    }

    //Open Get Apps form component
    openGetAppsForm() {
        this.showGetAppsForm = !this.showGetAppsForm
    }

    // Open shorten notification block
    openShortenNotificationBlock(event,value ) {
        if (event == 'open') {
            this.notificationShortenContainer = true;
            if (value == 'personal') {
                this.notificationShortenContainerPersonal = true;
                this.notificationShortenContainerOrganization = false;
            } else {
                this.notificationShortenContainerOrganization = true;
                this.notificationShortenContainerPersonal = false;
            }
        } else {
            this.notificationShortenContainer = false;
        }
    }

    //Show notification page
    showNotificationPage() {
        this.global.notificationPageVisible = true;
        this.notificationShortenContainer = false;
        this.leftColumnBiggerIndex = false;
        this.global.showUploadForm = false;
    }

    //On hover on upload button change class
    onHovering() {
      this.leftColumnBiggerIndex = true;
    }
    //On unhover on upload button change class
    onUnovering() {
     this.leftColumnBiggerIndex = false;
    }

    /**
     * Open add new account popup
     */
    openAddNewAccount() {
        this.addNewAccountVisible = true;
        this.global.headerLowerZindex = true;
    }

    /**
     * Close add new account popup
     * @param event
     */
    closeAddNewAccount(event) {
        this.addNewAccountVisible = event;
        this.global.headerLowerZindex = false;
    }
}