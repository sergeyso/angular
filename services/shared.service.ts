/**
 * Created by toni on 27.2.17.
 */
import {Injectable}    from '@angular/core';
import {GlobalService} from "./global.service";

@Injectable()
export class SharedService {

    loadSharedUser: boolean = true;
    loadMakePublic: boolean = false;
    sharedId: number;
    checkPublic: boolean;
    sharedWith: Array<any> = [];
    constructor(
        private globalService: GlobalService
    ) {}

    checkSharedWith(object, url) {
        // if (this.sharedId !== object.id) {
            this.sharedWith = [];
            this.sharedId = object.id;
            this.makeRequestGetObject(url);
        // } else {
        //     this.loadSharedUser = false;
        // }
    }

    makeRequestGetObject(url) {
        const urlReconfigure = url === 'questions' ? 'questions/view' : url;
        this.globalService.getRquest(`${this.globalService.apiUrl}${urlReconfigure}/${this.sharedId}`).subscribe(
            users => {
                if (Array.isArray(users.response_data)) {
                    this.sharedWith = users.response_data[0].sharedWithUsers;
                } else {
                    this.sharedWith = users.response_data.sharedWithUsers;
                }

                this.loadSharedUser = false;
                this.loadMakePublic = false;
            },
            (err: any) => {
                console.error(err);
                this.loadMakePublic = false;
                this.loadSharedUser = false;
            });
    }

    checkSharedPublic(object, access) {
        if (object.access.other.indexOf(access) > -1) {
            this.checkPublic = true;
        } else {
            this.checkPublic = false;
        }
    }

    public makePublicOrPrivate(newObject, type, accessType) {
        try {
            this.loadMakePublic = true;
            this.checkPublic = !this.checkPublic;
            const access = this.isString(newObject.access);
            if(this.checkPublic) {
                access.other = [accessType];
            } else {
                access.other = [];
            }
            /*newObject.access = JSON.stringify(access);*/
            this.callserver({
                id: newObject.id,
                access: JSON.stringify(access)
            }, type).then(success => {
                this.loadMakePublic = false;
            });
        } catch (e) {
            this.loadMakePublic = false;
            console.error(e);
/*            location.reload();*/
        }
    }

    callserver(newObject, type) {
        return new Promise((resolve, reject) => {
            this.globalService.postRquest(this.callUrl(type) + this.sharedId, newObject).subscribe(
                (update: Response) => {
                    this.globalService.sharedFileContent = update.response_data[0];
                    this.globalService.paginateFeeds = this.globalService.paginateFeeds.map(a => {
                            if (a.id === this.globalService.sharedFileContent.id && a.type === this.globalService.sharedFileContent.type) {
                                console.log(update.response_data[0]);
                                return update.response_data[0];
                            } else {
                                return a;
                            }

                        });
                    resolve(true)
                },
                (err: any) => {
                    resolve(true);
                    console.error('errol');
                });
        });
    }

    callUrl(type) {
        if (type === 'folder') {
            return this.globalService.apiUrl + 'folders/'
        } else if(type === 'posts') {
            return this.globalService.apiUrl + 'posts/'
        } else if(type === 'questions') {
            return this.globalService.apiUrl + 'questions/'
        }

        return this.globalService.apiUrl + 'files/';
    }

    private isString(type) {
        if (typeof type === 'string') {
            return JSON.parse(type);
        }

        return type
    }

    isShared() {
        $('.text-share').bind('contextmenu', (e) => {
            if(!this.checkPublic) {
                return false
            }
            return true;
        });
    }
}