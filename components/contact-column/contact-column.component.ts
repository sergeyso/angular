import {ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {GlobalService} from '../../services/global.service';
import {NgModel} from '@angular/forms';
import {UsersService} from '../../services/users.service';
import {SectorService} from "../../services/sector.service";
declare let $: any;
@Component({
    selector: 'contact-column',
    templateUrl: 'contact-column.html'
})
export class ContactColumn {
    invitedUsersArray: any = [];
    moreContactsContainerVisible: boolean = false;
    email: string;
    @ViewChild('emailInput') emailInput: NgModel;
    text: string = '';
    searchContact: string = '';
    notConfirmedUsersBox: boolean = false;
    openPopup: number = 0;
    @ViewChild('notConfirmedUser') notConfirmedUser;
    @ViewChild('mainBox') mainBox: ViewChild;

    constructor(
        public global: GlobalService,
        public userService: UsersService,
        public sectorService: SectorService
    ) {
        this.setInvitedUsers();
    }

    submitEmail() {
        if (this.emailInput.control.hasError('validateEmail') || !this.email) {
            this.text = 'Invalid email address';
            this.timeoutChangeText();
        } else {
            this.text = '';
            this.inviteUser();
        }
    }

    contactSearch() {

    }

    private inviteUser() {
        this.userService.addNewContact(this.email).subscribe(
            (succesfully: Response) => {
                this.addContactIntoGlobal(succesfully);
                this.text = 'Invitation sent successfully';
                this.email = '';
                this.timeoutChangeText();
            }, error => {
                console.error(error);
            }
        )
    }

    private addContactIntoGlobal(succesfully: Response) {
        try {
            if (succesfully.response_data.contacts.length) {
                this.addNewContact(succesfully.response_data.contacts[0]);
            } else {
                this.invitedUsersArray.push(...succesfully.response_data.invites)
            }
        } catch (e) {
            console.error(e, 'user not added')
        }
    }

    private addNewContact(object) {
        if (!this.containsObject(object, this.global.contacts)) {
            this.global.contacts.push(object);
        }
    }

    private containsObject(obj, list) {
        let i;
        for (i = 0; i < list.length; i++) {
            if (list[i].id == obj.id) {
                return true;
            }
        }

        return false;
    }

    private timeoutChangeText() {
        setTimeout(() => {
            this.text = '';
        }, 5000);
    }

    /* Load more contacts on click */
    loadMoreContacts() {
        this.moreContactsContainerVisible = !this.moreContactsContainerVisible;
    }

    /**
     * Open action box for not confirmed users
     */
    openNotConfirmedActions(id: number): void {
         if (this.openPopup === id) {
             this.openPopup = 0;
             return;
         }

        this.openPopup = id;
    }

    /**
     * Click invite again
     */
    inviteAgain(id: number): void {
        this.openPopup = 0;
        this.userService.resendInvitation(id).subscribe(
            (successfully: Response) => {
                this.text = 'Invitation sent successfully';
                this.email = '';
                this.timeoutChangeText();
            }, error => {
                console.error(error);
            }
        )
    }

    /**
     * Click withdraw invitation
     */
    withdrawInvitation(id: number): void {
        this.openPopup = 0;
        this.userService.withdrawInvitation(id).subscribe(
            (successfully: Response) => {
                this.removeInvitedUsers(id);
                this.text = 'Invitation withdrawn successfully';
                this.email = '';
                this.timeoutChangeText();
            }, error => {
                console.error(error);
            }
        )
    }

    // /**
    //  * clicking outside container to close it
    //  */
    //  @HostListener('document:click', ['$event'])
    //  clickout(event) {
    //      if (!this.notConfirmedUser.nativeElement.contains(event.target)) {
    //          this.openNotConfirmedUserClick(event);
    //      }
    //  }
    //
    //  /**
    //   * Click Private Channel
    //   * @param event
    //   */
    //  private openNotConfirmedUserClick(event): void {
    //      if (!this.notConfirmedUser.nativeElement.contains(event.target)) {
    //          this.openPopup = 0;
    //          this.notConfirmedUser = false;
    //      }
    //  }

    setInvitedUsers() {
        this.userService.setInvitedUsers()
            .subscribe((response: Response) => {
                this.invitedUsersArray = response.response_data;
            });

        // this.invitedUsersArray = JSON.parse(document.getElementById('mainDiv').getAttribute('invitesUsers'));
        // document.getElementById('mainDiv').removeAttribute('invitesUsers');
    }

    removeInvitedUsers(id: number): void {
        this.invitedUsersArray = this.invitedUsersArray.filter(function( obj ) {
            return obj.id !== id;
        });
    }
}
