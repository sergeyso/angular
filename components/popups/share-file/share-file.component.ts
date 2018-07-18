import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {GlobalService} from '../../../services/global.service';
import {SharedService} from '../../../services/shared.service';
import {Select2} from '../../../helpers/select2';
import {File} from '../../../models/class/file.model';


@Component({
    selector: 'app-share-file-popup',
    templateUrl: 'share-file.html'
})
export class ShareFilePopupComponent extends Select2 implements AfterViewInit {
    @ViewChild('shortUrl') shortUrl;
    type: string;
    fileOrPost: object = {};
    question: object = {};

    constructor(
        public globalService: GlobalService,
        public sharedService: SharedService
    ) {
        super(globalService);
        this.checkTypeOfFile();
        this.sharedService.loadSharedUser = true;
        sharedService.checkSharedWith(this.globalService.sharedFileContent, this.type);
    }

    ngAfterViewInit() {
        this.accessSelect(Object.keys(this.globalService.sharedFileContent.access.users));
        this.accessSelectChange();
        this.sharedService.isShared();
    }

    checkTypeOfFile() {
        if (this.globalService.sharedFileContent.type === 'post') {
            this.type = 'posts';
        } else if (this.globalService.sharedFileContent.type === 'file') {
            this.type = 'files';
        } else {
            this.type = 'questions';
        }
    }

    addNewUserFunc() {
        try {
            this.updateShareAccess();
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Copy link to clipboard
     */
    copyToClipBoard() {
        const copyText = this.shortUrl.nativeElement;
        copyText.select();
        document.execCommand('copy');
    }

    /**
     * Update Share Access
     */
    private updateShareAccess() {
        if (this.globalService.sharedFileContent.type === 'question') {
            this.updatePostQuestion().then();
        } else {
            this.updatePostOrFile();
        }
        $('.shareaccess').val([]).trigger('change');
    }

    /**
     * Update Question
     */
    async updatePostQuestion() {
        await this.accessStructureQuestion();
        this.question['privacy_id'] = this.globalService.sharedFileContent.privacy_id;
        this.sharedService.callserver(this.question, this.type).then(success => {
            this.sharedService.makeRequestGetObject(this.type);
            this.globalService.hideShareFilePopup();
        }, error => {
            console.error(error);
            this.sharedService.loadMakePublic = false;
        });
    }

    /**
     * Update Post or Files
     */
    updatePostOrFile(): void {
        const object = this.accessStructure();
        if (this.newUser) {
            this.invitedNewContact(this.globalService.sharedFileContent.id, object.newUser);
        }

        if (Object.keys(object.accessUser).length !== 0) {
            this.globalService.sharedFileContent.access.users = Object.assign(
                object.accessUser,
                this.globalService.sharedFileContent.access.users
            );
        }
        this.sharedService.loadMakePublic = true;
        this.fileOrPost['access'] = JSON.stringify(this.globalService.sharedFileContent.access);
        this.fileOrPost['privacy_id'] = this.globalService.sharedFileContent.privacy_id;
        this.sharedService.callserver(this.fileOrPost, this.type).then(success => {
            this.sharedService.makeRequestGetObject(this.type);
            this.globalService.hideShareFilePopup();
        }, error => {
            console.error(error);
            this.sharedService.loadMakePublic = false;
        });
    }

    deleteUser(user) {
        try {
            if(this.globalService.sharedFileContent.type === 'question') {
                if (user.status === 'active') {
                    this.deleteUserFormQuestion(user);
                }
            } else {
                if (user.status === 'active') {
                    return this.deleteActiveUser(user);
                }
                return this.deleteInvitedUser(user);
            }
        } catch (e) {
            console.error(e);
        }
    }


    deleteUserFormQuestion(user) {
        const syncUsersIds = this.sharedService.sharedWith.filter(a => {
            if (a.id !== user.id) {
                return a.id;
            }
        }).map(a => {
                return a.id;
        });

        this.sharedService.callserver({
            syncUsersIds: JSON.stringify(syncUsersIds)
        }, this.type).then(success => {
            if (this.sharedService.sharedWith.length === 1) {
                this.sharedService.sharedWith = [];
            }
            this.sharedService.makeRequestGetObject(this.type);
        });
    }

    deleteActiveUser(user) {
        this.sharedService.loadMakePublic = true;
        this.globalService.sharedFileContent.access.users[user.id] = [];
        this.fileOrPost['access'] = JSON.stringify(this.globalService.sharedFileContent.access);
        this.sharedService.callserver(this.fileOrPost, this.type).then(success => {
            if (this.sharedService.sharedWith.length === 1) {
                this.sharedService.sharedWith = [];
            }
            this.sharedService.makeRequestGetObject(this.type);
        });
    }

    protected deleteInvitedUser(user) {
        this.sharedService.loadMakePublic = true;
        this.globalService.deleteRquest(`${this.globalService.apiUrl}invites/${user.id}`).subscribe(success => {
            if (this.sharedService.sharedWith.length === 1) {
                this.sharedService.sharedWith = [];
            }
            this.sharedService.makeRequestGetObject(this.type);
        });
    }

    /**
     * @returns {string}
     */
    sharedImage() {
        try {
            return this.globalService.sharedFileContent.filedata.link
        } catch (e) {
            return '';
        }
    }

    /**
     * @returns {string}
     */
    sharedTitle() {
        try {
            return this.globalService.sharedFileContent.name ?
                this.globalService.sharedFileContent.name :
                this.globalService.sharedFileContent.text;
        } catch (e) {
            return '';
        }
    }

    /**
     * @returns {string}
     */
    sharedDescription() {
        try {
            return this.globalService.sharedFileContent.description
        } catch (e) {
            return '';
        }
    }


    /**
     * Access structure for question
     * @returns {Promise<boolean>}
     */
    accessStructureQuestion(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (this.fileAccess.length) {
                this.fileAccess.forEach((a: any, e) => {
                    const number = parseInt(a);
                    if (Number.isInteger(number)) {
                        if (!this.question['addUsersIds']) {
                            this.question['addUsersIds'] = [];
                        }
                        this.question['addUsersIds'].push(number);
                    } else {
                        if (!this.question['syncUserEmails']) {
                            this.question['syncUserEmails'] = [];
                        }
                        if (a) {
                            this.question['syncUserEmails'].push(a);
                        }
                    }
                    if (this.fileAccess.length === (e + 1)) {
                        this.question['addUsersIds'] = JSON.stringify(this.question['addUsersIds']);
                        this.question['syncUserEmails'] = JSON.stringify(this.question['syncUserEmails']);
                        resolve(true);
                    }
                });
            } else {
                resolve(true);
            }
        });

    }
}
