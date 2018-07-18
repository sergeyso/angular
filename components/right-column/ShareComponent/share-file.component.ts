import {Component, AfterViewInit} from '@angular/core';
import {GlobalService} from "../../../services/global.service";
import {File} from "../../../models/class/file.model";
import {Select2} from "../../../helpers/select2";
import {SharedService} from "../../../services/shared.service";
import {RshService} from "../../../services/rsh.service";

@Component({
    selector: 'share-file',
    templateUrl: 'share-file.html'
})
export class ShareFileComponent extends Select2 implements AfterViewInit{
    shareTitle = "Sharing is caring";
    fbTemp = "<img class='share-content-social' src='images/share-to-fb.png'>";
    twitterTemp = "<img class='share-content-social' src='images/share-to-tw.png'>";

    feedImage: string;

    file: File = new File(
        this.globalService.rightColumnValueFeed.id,
        this.globalService.rightColumnValueFeed.name,
        this.globalService.rightColumnValueFeed.description,
        this.globalService.rightColumnValueFeed.folder_id,
        null,
        this.globalService.rightColumnValueFeed.access,
    );

    constructor(
        public rhsService: RshService,
        public globalService: GlobalService,
        public sharedService: SharedService,
    ) {
        super(globalService);
        this.getImage();
        this.sharedService.loadSharedUser = true;
        sharedService.checkSharedWith(this.globalService.rightColumnValueFeed, 'files');
        sharedService.checkSharedPublic(this.globalService.rightColumnValueFeed, 'read');
    }

    getImage() {
        try {
            if(this.globalService.rightColumnValueFeed.file_type == 'image') {
                this.feedImage = this.globalService.rightColumnValueFeed.filedata.encodings[1].uri;
            } else {
                this.feedImage = this.globalService.rightColumnValueFeed.previewdata.encodings[1].uri;
            }
        } catch (e) {
            this.feedImage = this.globalService.apiUrl+'images/default.png';
        }

    }

    ngAfterViewInit() {
        this.accessSelect(Object.keys(this.globalService.rightColumnValueFeed.access.users));
        this.accessSelectChange();
        this.sharedService.isShared();
    }

    addNewUserFunc() {
        try {
            if (this.fileAccess.length) {
                this.updateShareAccess();
            }
        } catch (e) {
            console.error(e);
        }
    }

    private updateShareAccess() {
        let object = this.accessStructure();
        if(this.newUser) {
            this.invitedNewContact(this.globalService.rightColumnValueFeed.id, object.newUser);
        }

        if(Object.keys(object.accessUser).length != 0) {
            this.globalService.rightColumnValueFeed.access.users = Object.assign(object.accessUser, this.globalService.rightColumnValueFeed.access.users);
        }
            this.sharedService.loadMakePublic = true;
            this.file.access = JSON.stringify(this.globalService.rightColumnValueFeed.access);
            this.sharedService.callserver(this.file, 'file').then(success => {
                this.file.sharecomment = '';
                this.sharedService.makeRequestGetObject('files');
            }, error => {
                console.error(error);
                this.sharedService.loadMakePublic = false;
            });
        $('.shareaccess').val([]).trigger("change");
    }

    deleteUser(user) {
        try {
            if (user.status === 'active') {
                return this.deleteActiveUser(user);
            }
            return this.deleteInvitedUser(user);
        } catch (e) {
            console.error(e);
        }
    }

    deleteActiveUser(user) {
        this.sharedService.loadMakePublic = true;
        this.globalService.rightColumnValueFeed.access.users[user.id] = [];
        this.file.access = JSON.stringify(this.globalService.rightColumnValueFeed.access);
        this.sharedService.callserver(this.file, 'file').then(success => {
            if(this.sharedService.sharedWith.length == 1) {
                this.sharedService.sharedWith = [];
            }
            this.sharedService.makeRequestGetObject('files');
        });
    }

    protected deleteInvitedUser(user) {
        this.sharedService.loadMakePublic = true;
        this.globalService.deleteRquest(`${this.globalService.apiUrl}invites/${user.id}`).subscribe(success => {
            if(this.sharedService.sharedWith.length == 1) {
                this.sharedService.sharedWith = [];
            }
            this.sharedService.makeRequestGetObject('files');
        });
    }
}