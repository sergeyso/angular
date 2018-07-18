import {Component} from '@angular/core';
import {GlobalService} from "../../../services/global.service";
import {FeedService} from "../../../services/feeds.service";
import {FolderService} from "../../../services/folder.service";

@Component({
    selector: 'header-app',
    templateUrl: 'profile-header.html',
})
export class ProfileHeader {

    searchFiles: string;
    caseFriend: string = '';

    constructor(
        public globalService: GlobalService,
        public feedServices: FeedService,
        public folderService: FolderService
    ) {
        this.checkHasFriend();
        this.updateBreadCrumbs();
    }

    updateBreadCrumbs()
    {
        this.globalService.rootName = this.globalService.currentUser.fullname;
        this.folderService.arrayBreadCump[0].name = this.globalService.currentUser.fullname;
    }

    onSubmit() {
        this.globalService.checkShowMyContent();
        this.feedServices.onSubmitSearch(this.searchFiles);
    }

    /*Show send file form*/
    sendFile() {
        this.globalService.sendFilePopupVisible = true;
    }

    checkHasFriend() {
        if(this.globalService.currentUser.friend) {
            return this.caseFriend = 'Unfollow';
        }

        return this.caseFriend = 'Follow'
    }

    changeFriend() {
        let oldCaseFriend = this.caseFriend;
        try {
            if(this.caseFriend == 'Follow') {
                this.addContact();
                this.caseFriend = 'Unfollow'
            } else {
                this.deleteContact();
                this.caseFriend = 'Follow';
            }
        } catch (e) {
            this.caseFriend = oldCaseFriend;
        }
    }

    deleteContact() {
        this.globalService.deleteRquest(`${this.globalService.apiUrl}contacts/deletecontacts`, {
            'user_ids[]': this.globalService.currentUser.id
        }).subscribe(
            success => {
                console.log(success);
                this.getAllContacts();
            }, error2 => {
                console.log(error2)
            }
        )
    }

    addContact() {
        this.globalService.postRquest(`${this.globalService.apiUrl}contacts/addbyids`, {
            Contact: [{contact_user_id: this.globalService.currentUser.id}]
        }).subscribe(
            success => {
                console.log(success);
                this.getAllContacts();
            }, error2 => {
                console.log(error2)
            }
        )
    }

    getAllContacts() {
        this.globalService.getRquest(`${this.globalService.apiUrl}contacts/search`).subscribe(
            success => {
                this.globalService.contacts = success.response_data;
            }, error2 => {
                console.log(error2)
            }
        )
    }
}