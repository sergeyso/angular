import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../../../services/global.service";
import {RshService} from "../../../services/rsh.service";
import {Router} from "@angular/router";
import {Checkbox} from "../../../models/class/licenceFileOption/checkbox";
import {Amount} from "../../../models/class/licenceFileOption/amount";
import {LicenceService} from "../../../services/licence.service";

@Component({
    selector: 'right-file-column',
    templateUrl: 'right-file-column.html'
})
export class RightColumnFile implements OnInit {

    constructor(
        public globalService: GlobalService,
        public rhsService: RshService,
        public licenceService: LicenceService,
        public router: Router
    ) {
        globalService.itsOwnerSubject.subscribe((value) => {
            if(!value) {
                this.checkLicence()
            } else {
                this.licenceService.loaded = true
            }
        });
    }

    ngOnInit() {
        try {
            if(!this.globalService.itsOwner) {
                if(this.globalService.rightColumnValueFeed.id != this.licenceService.id) {
                    this.checkLicence()
                } else {
                    this.licenceService.loaded = true
                }
            } else {
                this.licenceService.loaded = true
            }
        } catch (e) {
            this.checkLicence()
        }

    }

    //Show popup container
    showPopupContainer(value) {
        if (this.globalService.isObject(this.globalService.getValueFormImageFeed(value))) {
              this.router.navigate(['/c/'+this.globalService.rightColumnValueFeed.hash_id]);
        }
    };

    private checkLicence() {
        this.licenceService.licenceFile = [];
        this.licenceService.loaded = false;
        this.licenceService.checkbox = new Checkbox();
        this.licenceService.amount = new Amount();
        this.licenceService.getLicence().then(
            (isSuccess: any) => {
                if(isSuccess.status == 1) {
                    console.log(isSuccess);
                    this.licenceService.licenceFile = isSuccess.licensing_options;
                    this.licenceService.id = isSuccess.video_id;
                }
                this.licenceService.loaded = true;
            }, error => {
                console.error(error);
                this.licenceService.loaded = true
            }
        );
    }
}