/**
 * Created by toni on 20.12.16.
 */
import {Injectable, NgZone} from '@angular/core';
import {Headers, URLSearchParams, Response, Http} from '@angular/http';
import {RshService} from './rsh.service';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class GlobalService {
    public question: any;
    public currentRoute: string = '/';
    public apiUrl: string = window['api'];
    public appUrl: string = window['app'];
    public paginateFeeds: Array<any> = [];
    public paginateFeedsCache: Array<any> = [];
    public simpleFeedPageVisible: boolean = false;
    public login: any;
    public currentUser: any;
    public showUploadForm: boolean = false;
    public secondColumnvisible: boolean = false;
    public folders: Array<any> = [];
    fourthColumnvisible: string | null = null;
    indexFeed: boolean = null;
    finishFeed: boolean = false;
    finishFolders: boolean = false;
    processFeed: boolean = true;
    progress: number = 0;
    showProgress: boolean = false;
    fileName: string = 'Pick a file to upload';
    rightColumnValueFeed: any;
    scrollbarHeigt: number = 200;
    scrollbarRightColHeigt: number = 200;
    headerPart: string;
    sendFilePopupVisible: boolean = false;
    uploadForm: boolean = false;
    charLeftSearchVisible: boolean = false;
    deleteFolderForm: boolean = false;
    deleteFile: boolean = false;
    coverPopup: boolean = false;
    channel: any;
    channelPreviewPopup: boolean = false;
    search: string = '';
    searchTag: string = '';
    optionsFiles: boolean = false;
    indexFile: number;
    selectedTapSettings: number = 0;
    selectedSettingsTab: string = 'profile';
    folderObject: any = null;
    fileSharedWith: Array<any> = [];
    fileSharedWithResponse: boolean = false;
    contacts: Array<any>;
    explanation: boolean = false;
    explanationStepOneVisible: boolean = false;
    explanationStepTwoVisible: boolean = false;
    explanationStepThreeVisible: boolean = false;
    arrayObjectUpload: Array<any> = [];
    itsOwner: any;
    itsOwnerSubject: Subject<any> = new Subject<any>();
    itsOwnerDelete: string = '';
    openFileUploadForm: Subject<boolean> = new Subject<boolean>();
    loadingRequest: boolean = false;
    newFiles: Array<number> = [];
    notificationPageVisible: boolean = false;
    showMyContent: boolean = true;
    rootName: string = 'Main Feed';
    file: any;
    showAnswerBottomVar: boolean = false;
    headerBigerZindex: boolean = false;
    leftColumnVisibile: boolean = true;
    headerLowerZindex: boolean = false;
    url = window.location.pathname.split('/')[1];
    sharePopupVisible: boolean = false;
    popupHeight: number = 0;
    liveSetupForm: boolean = false;
    liveEditObject: any;
    postEditObject: any;
    editFileVisible: any;
    editPostVisible: any;
    sharedFileContent: any = null;
    commentSubsctiption: BehaviorSubject<any> = new BehaviorSubject('');
    invitesUsers: any = [];
    companies: any = [];


    /**
     * Shared Authorization Header
     * @returns {Headers}
     */
    static sharedAuthorizationHeader() {
        const headers = new Headers();
        headers.append('Authorization', 'Basic YXBpQG1haWwubG9jOjI2amU0SjhmUHBWdllBRko=');
        return headers;
    }

    /**
     * @param paramsValue
     * @returns {any}
     */
    static putParams(paramsValue: any) {
        if (paramsValue) {
            return GlobalService.loopObjectParams(new URLSearchParams(), paramsValue);
        }
        return new URLSearchParams();
    }

    /**
     * @param params
     * @param paramsValue
     * @returns {any}
     */
    private static loopObjectParams(params, paramsValue) {
        console.log(paramsValue);
        for (const i in paramsValue) {
            if (paramsValue[i] === 'all' || paramsValue[i] === 'peoples' || paramsValue[i] === 'channels' || paramsValue[i] === 'folders') {
                //
            } else {
                params.set(i, paramsValue[i]);
            }
        }
        return params;
    }

    /**
     * Constructor
     * @param rshService
     * @param http
     * @param router
     * @param lc
     */
    constructor (
        private rshService: RshService,
        private http: Http,
        public router: Router,
        public lc: NgZone
    ) {}

    /**
     * Open File Upload Form
     */
    toggleFileUploadForm() {
        this.openFileUploadForm.next(true);
    }

    /**
     * Show fourth column video display
     * @param value
     * @param index
     * @param oneClick
     */
    showColumn(value, index, oneClick = false) {
        this.optionsFiles = false;
        try {
            if (this.indexFeed !== value.id && !oneClick) {
                this.hideFourthColumn();
                if (window.innerWidth < 1100) {
                    window.scrollTo(0, 0);
                }
                this.itsOwner = this.isOwnerFile(value);
                this.rightColumnValueFeed = value;
                this.showRightColumnFile();
                this.indexFeed = value.id;
                this.indexFile = index;
                this.rshService.hideColumt();
                this.fileSharedWith = [];
                this.fileSharedWithResponse = false;
                if (this.explanationStepTwoVisible) {
                    this.explanationStepThreeVisible = true;
                }
                this.itsOwnerSubject.next(this.itsOwner);
            } else {
                if (!this.explanation) {
                    if (oneClick) {
                        this.rightColumnValueFeed = value;
                        this.fourthColumnvisible = null
                    }
                    const data = this.rightColumnValueFeed.file_type === 'video' ?
                        this.rightColumnValueFeed.previewdata :
                        this.rightColumnValueFeed.filedata;
                    if (this.isObject(data)) {
                        this.router.navigate(['/c/' + this.rightColumnValueFeed.hash_id]);
                        this.indexFeed = null;
                    }
                }
            }
        } catch (e) {
            console.error(e);
            this.hideFourthColumn();
        }
    };

    private showRightColumnFile() {
        if (this.rightColumnValueFeed) {
            this.fourthColumnvisible = 'file';
        } else {
            this.fourthColumnvisible = null;
        }
    }

    setCompanies() {
        let headers = this.createAuthorizationHeader();
        return this.http.get(this.apiUrl + 'companies', {
            headers: headers,
        })
    }

    setContacts() {
        let headers = this.createAuthorizationHeader();
        this.http.get(this.apiUrl + 'contacts/search?per-page=0', {
            headers: headers,
        }).subscribe((response: Response) => {
            this.contacts = response.json().response_data;
        })
    }

    setInvitesUsers() {
        let headers = this.createAuthorizationHeader();
        this.http.get(this.apiUrl + 'invites/list', {
            headers: headers,
        }).subscribe((response: Response) => {
            this.invitesUsers = response.json().response_data;
        })
    }

    /**
     * Hide RightColumn
     */
    hideFourthColumn() {
        this.processFeed = true;
        this.fourthColumnvisible = null;
        this.indexFeed = null;
        this.rightColumnValueFeed = null;
        this.folderObject = null;
    }

    isObject(val) {
        if (val == null) {
            return false
        } else if (typeof val === 'object' && val.encodings.length) {
            return true;
        }
        return false
    }

    createAuthorizationHeader() {
        const headers = new Headers();
        headers.append('Authorization', 'Basic ' +
            btoa(this.login.credentials[0] + ':' + this.login.credentials[1]));
        return headers;
    }

    createAuthorizationToken() {
        return btoa(this.login.credentials[0] + ':' + this.login.credentials[1]);
    }

    popupValueShowRightColumn(value, object = null, index = null) {
        if (this.currentRoute !== '/lean-back') {
            if (object && index) {
                this.indexFeed = null;
                this.showColumn(object, index);
            }
            this.router.navigate([this.currentRoute]);
            window.history.replaceState(null, null, this.currentRoute);
            this.rshService.showColumn(value);
        }
    }

    filterAnimate() {
        $('html, body').animate({ scrollTop: 0 }, 'fast');
        this.hideFourthColumn();
        this.finishFeed = false;
    }

    getValueFormImageFeed(value) {
        if (value.file_type === 'image') {
            return value.filedata;
        }
        return value.previewdata;
    }

    /**
     * @param url
     * @param model
     * @returns {Observable<R>}
     */
    postRquest (url: string, model: Object) {
        this.loadingRequest = true;
        const headers = this.createAuthorizationHeader();
        return this.http.post(url, model, {
            headers: headers
        })
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * @param url
     * @param params
     * @param shared
     * @returns {Observable<R>}
     */
    getRquest(url: string, params: string | Object | null = null, shared: boolean = false) {
        this.loadingRequest = true;
        return this.http.get(url, {
            headers: this.auth(shared),
            params: GlobalService.putParams(params)
        })
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteRquest(url: string, params: string | Object | null = null, shared: boolean = false) {
        this.loadingRequest = true;
        return this.http.delete(url, {
            headers: this.auth(shared),
            params: GlobalService.putParams(params)
        })
            .map(this.extractData)
            .catch(this.handleError);
    }

    getRequestPagination(url: string, params: string | Object | null = null, shared: boolean = false) {
        this.loadingRequest = true;
        return this.http.get(url, {
            headers: this.auth(shared),
            params: GlobalService.putParams(params)
        })
            .map(this.extractDataAll)
            .catch(this.handleError);
    }

    private auth(shared) {
        if (shared) {
            return GlobalService.sharedAuthorizationHeader();
        }
        return this.createAuthorizationHeader()
    }

    extractData(res: Response) {
        return res.json() || { };
    }

    extractDataAll(res: Response) {
        return res;
    }

    private handleError (error: Response | any) {
        return Observable.throw(error.json().response_data);
    }

    validateNumber(event: any) {
        const key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46
            || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        } else if ( key > 95 && key < 106 ) {
            return true;
        } else if ( key < 48 || key > 57 ) {
            return false;
        } else {
            return true;
        }
    }

    isOwnerFile(file) {
        if (this.login.data.id in file.access.users) {
            const user = file.access.users[this.login.data.id];
            if (user.indexOf('write') !== -1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false
        }
    }

    checkShowMyContent() {
        if (this.headerPart !== 'profile') {
            this.showMyContent = true;
        } else {
            this.showMyContent = this.currentUser.id === this.login.data.id;
        }
    }
    /**
     ** Show sharing popup
    **/
    showSharePopoup(value: object) {
        this.sharedFileContent = value;
        this.sharePopupVisible = true;
        return false;
    }

    /**
     ** Hide sharing popup
     **/
    hideShareFilePopup() {
        this.sharePopupVisible = false;
        this.sharedFileContent = null;
    }
}

