/**
 * Created by t_mit on 1/16/2017.
 */
import {Injectable, NgZone} from '@angular/core';
import {Http, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import {GlobalService} from './global.service';
import {FeedService} from './feeds.service';
import {Breadcrumbs} from '../models/class/breadcrumbs.model';
import {ChannelHelper} from '../helpers/Channels/ChannelHelper';
import {ChannelService} from "./channel.service";

@Injectable()
export class FolderService {
    length: number = 0;
    private url = this.globalService.apiUrl;  // URL to web api
    public folders: any;
    public folderSelectedForDelete: any;
    public folderSelectedForEdit: any;
    public folderSelectedForEditName: any;
    folderSelectedObject: any = {};
    folderSelectedBoolean: boolean = false;
    countFolderRoot: any = 0;
    processfolder = true;
    folderTypeSelected: string = '';
    specificFoldeFiles: any;
    specificSubFoldeFiles: any;
    selected: number;
    subfolderFormVisible: number = null;
    editfolderFormVisible: number = null;
    editSubfolderFormVisible: number = null;
    selectedSubfolders: number;
    folderIdSelected: number;
    shareButtonHeader: boolean = false;

    root: Breadcrumbs = new Breadcrumbs(
        'root',
        '',
        this.globalService.rootName,
        'mainFeed',
        ''
    );
    parentFolder: Breadcrumbs;
    arrayBreadCump: Array<Breadcrumbs> = [
        this.root,
    ];
    clickReturnByFile: boolean = false;
    sharedFolder: any;
    folderPage: number = 0;
    rootFolderNotify: any;
    channelHelper: ChannelHelper = new ChannelHelper;
    public filterLive: any = {
        isUpcoming: true,
        isPassed: true,
        isLive: true,
        isOther: true,
    };

    constructor(private http: Http,
                private globalService: GlobalService,
                private feedService: FeedService,
                private channelService: ChannelService,
                public lc: NgZone) {
    }

    /**
     * @returns {Observable<any | any>}
     */
    setFolders() {
        let headers = this.globalService.createAuthorizationHeader();
        this.http.get(this.url + 'folders/tree', {
            headers: headers,
        }).subscribe((response: Response) => {
            this.folders = response.json().response_data;
        })
    }

    getAllFolder() {
        let headers = this.globalService.createAuthorizationHeader();
        return this.http.get(this.url + 'folders/tree', {
            headers: headers,
            // params: {
            //     'sort': 'nameasc'
            // }
        })
            .map(this.extractData)
            .catch(this.handleError);
    }

    getFilesSpecificFolder(id) {
        this.folderPage = this.folderPage + 1;
        let url;
        if (id == 'root') {
            url = this.url + 'files/self?filter[folder_id]=' + id + '&page=' + this.folderPage;
        } else {
            url = `${this.url}files/search?filter[folderhashid][]=${id}&page=${this.folderPage}`;
        }
        let headers = this.globalService.createAuthorizationHeader();
        return this.http.get(url, {
            headers: headers,
            params: this.feedService.loopFilters()
        })
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        return res.json() || {};
    }

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    deleteFolder(folder_id = null) {
        let headers = this.globalService.createAuthorizationHeader();
        let options = new RequestOptions({
            body: {
                folder_id: folder_id
            },
            headers: headers,
        });
        return this.http.delete(this.url + 'folders/' + this.folderSelectedForDelete, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    select(index: any, key: any, type: any, object = null): void {
        // Hide share button in header
        if (type === 'mainFeed') {
            this.channelService.channelSelected = undefined;
            type = 'root';
        }
        this.shareButtonHeader = false;
        try {
            const url = window.location.pathname.split('/')[1];
            if (url === '' || url === 'profile' || url === 'search') {
                if (this.globalService.showUploadForm) {
                    this.globalService.showUploadForm = false;
                    this.globalService.headerPart = 'feeds';
                    this.globalService.finishFeed = true;
                }
                if  (this.channelService.channelSelected !== undefined) {
                    this.selectedFolder(this.channelService.channelSelected, this.channelService.channel.id,
                        'channel', this.channelService.channel);
                } else {
                    this.selectedFolder(index, key, type, object);
                }
            } else {
                if (type === 'channel') {
                    document.location.href = '/?channel=' + index;
                    return;
                }
                let objectIs;
                if (object) {
                    objectIs = object.folder.id;
                } else {
                    objectIs = null
                }
                document.location.href = '/?index=' + index + '&key=' + key + '&type=' + type + '&object= ' + objectIs;
            }
        } catch (e) {
            document.location.href = '/';
        }
    }

    removeNotification(object) {
        let id = null;
        if (object) {
            object.notifications = null;
            id = object.folder.id;
        } else {
            id = 'root';
            this.rootFolderNotify = null
        }

        return id
    }

    notificationMarkered(id) {
        this.globalService.postRquest(`${this.globalService.apiUrl}notifications/markreaded`, {
            'ids': [id]
        }).subscribe();
    }

    selectedFolder(index, key, type, object = null, drag = false) {
        this.globalService.processFeed = true;
        this.feedService.filterTypeActive = '';
        this.folderPage = 0;
        this.processfolder = true;
        switch (type) {
            case 'folder':
                this.arrayBreadCump = this.breadcrumb(index, key, type, object);
                if (this.selected == null || this.selected !== index ||
                    this.folderTypeSelected !== 'folder' || this.clickReturnByFile === true) {
                    if (!drag) {
                        this.specificFoldeFiles = [];
                    }
                    this.specificSubFoldeFiles = [];
                    this.folderTypeSelected = type;
                    this.folderIdSelected = key;
                    this.selected = index;
                    if (this.feedService.filter.length) {
                        this.getFiles(key, this.folderTypeSelected, object);
                    } else {
                        this.removeContent();
                    }
                    if (object && object.folder.user_id === this.globalService.login.data.id) {
                        this.shareButtonHeader = true;
                    }
                    this.selectedSubfolders = null;
                }
                this.subfolderFormVisible = null;
                this.editfolderFormVisible = null;
                break;
            case'subfolder':
                this.arrayBreadCump = this.breadcrumb(index, key, type, object);
                if (this.selectedSubfolders == null || this.selectedSubfolders !== index ||
                    this.folderTypeSelected !== 'subfolder' || this.clickReturnByFile === true) {
                    this.specificFoldeFiles = [];
                    if (!drag) {
                        this.specificSubFoldeFiles = [];
                    }
                    this.folderTypeSelected = type;
                    this.selectedSubfolders = index;
                    this.folderIdSelected = key;
                    if (this.feedService.filter.length) {
                        this.getFiles(key, this.folderTypeSelected, object);
                    } else {
                        this.removeContent();
                    }
                }
                this.editfolderFormVisible = null;
                break;
            case'root':
                this.arrayBreadCump = this.breadcrumb(index, key, type, object);
                this.folderIdSelected = null;
                this.globalService.filterAnimate();
                this.selected = null;
                this.subfolderFormVisible = null;
                this.feedService.refreshPage = true;
                if (this.feedService.filter.length) {
                    this.feedService.checkHasFeed(true, true);
                } else {
                    this.removeContent();
                }
                break;
            case 'file':
                this.globalService.showColumn(object, index, true);
                break;
            case'channel':
                this.arrayBreadCump = this.breadcrumb(index, key, type, object);
                this.folderTypeSelected = type;
                this.folderIdSelected = key;
                this.globalService.filterAnimate();
                this.globalService.paginateFeeds = [];
                this.selected = null;
                this.subfolderFormVisible = null;
                this.feedService.refreshPage = true;
                this.getFilesChannel(key);
                this.globalService.channel = this.checkChannel(object);
                break;
        }
        this.clickReturnByFile = false;
    }

    /**
     * Check channel is owner
     * @param object
     * @return {any}
     */
    private checkChannel(object): any {
        if (object.user_id !== this.globalService.login.data.id) {
            return object;
        }

        return null
    }

    /**
     * Get files form selected channel
     * @param key
     */
    getFilesChannel(key) {
        this.folderPage = this.folderPage + 1;
        this.channelHelper.getFilesChannel(this.globalService, this.feedService, key, this.folderPage).then(
            isSuccess => {
                this.globalService.finishFeed = true;
                this.feedService.removeLoadMore(false);
            }, error => {
                this.feedService.removeLoadMore(false);
                this.globalService.processFeed = false;
                this.globalService.finishFeed = true;
                console.error(error);
            }
        );
    }

    private removeContent() {
        this.specificFoldeFiles = [];
        this.specificSubFoldeFiles = [];
        this.globalService.paginateFeeds = [];
        this.globalService.paginateFeedsCache = [];
    }

    getFiles(index, type, object = null) {
        this.globalService.filterAnimate();
        this.globalService.folderObject = object;
        this.getFilesSpecificFolder(index).subscribe(
            (successfully: any) => {
                if (type === 'folder') {
                    this.specificFoldeFiles = successfully.response_data;
                } else {
                    this.specificSubFoldeFiles = successfully.response_data;
                }
                let feedsGroupFiltered;
                if (this.feedService.filterTypeActive) {
                    feedsGroupFiltered = this.feedService.filteredFeed(successfully.response_data);
                    if (!feedsGroupFiltered.length) {
                        this.getFilesFromFilteredFolder();
                    }
                } else {
                    feedsGroupFiltered = successfully.response_data
                }
                this.globalService.paginateFeeds = feedsGroupFiltered;
                this.globalService.paginateFeedsCache = successfully.response_data;
                this.globalService.finishFeed = true;
                this.showRigthColumnFolderShare();
            },
            (err: any) => {
                if (type === 'folder') {
                    this.specificFoldeFiles = [];
                } else {
                    this.specificSubFoldeFiles = [];
                }
                this.globalService.paginateFeeds = [];
                this.globalService.paginateFeedsCache = [];
                this.globalService.finishFeed = true;
                this.showRigthColumnFolderShare();
                console.error(err);
            });
    }

    private showRigthColumnFolderShare() {
        if (this.globalService.folderObject) {
            this.globalService.fourthColumnvisible = 'folder';
        } else {
            this.globalService.fourthColumnvisible = null;
        }
    }

    showFile(file) {
        this.globalService.paginateFeeds = [file];
        this.arrayBreadCump = this.arrayBreadCump.filter((el) => {
            return el.type !== 'file'
        });
        this.arrayBreadCump.push(new Breadcrumbs(0, file.id, file.name, 'file', file));
        this.globalService.processFeed = false;
        this.clickReturnByFile = true
    }


    /**
     * Structure of breadcrumb
     * @param index
     * @param key
     * @param type
     * @param value
     * @returns {any}
     */
    private breadcrumb(index, key, type, value) {
        switch (type) {
            case 'root':
                return [
                    this.root,
                ];
            case 'folder':
                const valueCascate = this.cascateNullStr(value);
                const name = valueCascate ? value.folder.name : 'My Content';
                this.parentFolder = new Breadcrumbs(index, key, name, type, value);
                return [
                    this.root,
                    this.parentFolder
                ];
            case 'subfolder':
                return [
                    this.root,
                    this.parentFolder,
                    new Breadcrumbs(index, key, value.folder.name, type, value)
                ];
            case 'channel':
                return [
                    this.root,
                    new Breadcrumbs(index, key, value.name, type, value)
                ];
        }
    }

    private cascateNullStr(value) {
        if (value === 'null' || value === '') {
            return null
        }
        return value;
    }

    filterFeeds(value, search: boolean = false) {
        this.feedService.filter = value === this.feedService.filter ? 'all' : value;
        if (this.globalService.headerPart === 'search') {
            this.feedService.searchUrl = this.prepeareUrl();
        }
        this.length = this.feedService.filter.length;
        const valueBredcrumb = this.arrayBreadCump[this.arrayBreadCump.length - 1];
        this.clickReturnByFile = true;
        this.select(valueBredcrumb.index, valueBredcrumb.key, valueBredcrumb.type, valueBredcrumb.object)
    }

    private prepeareUrl() {
        switch (this.feedService.filter) {
            case 'all':
                return `${this.globalService.apiUrl}search`;
            case 'channels':
                return `${this.globalService.apiUrl}search/channels`;
            case 'peoples':
                return `${this.globalService.apiUrl}search/peoples`;
            case 'folders':
                return `${this.globalService.apiUrl}search/folders-array`;
            default :
                return `${this.globalService.apiUrl}search/files`;
        }
    }


    filterFeedsByTypeHeader(value, search: boolean = false) {
        if (this.feedService.filterTypeActive == value || value == 'all') {
            this.feedService.filterTypeActive = search ? 'all' : '';
            this.globalService.paginateFeeds = this.globalService.paginateFeedsCache;
        } else {
            this.feedService.filterTypeActive = value;
            this.globalService.paginateFeeds = this.feedService.filteredFeed(this.globalService.paginateFeedsCache);
            if (this.globalService.paginateFeeds.length < 2) {
                if (this.folderIdSelected) {
                    this.getFilesFromFilteredFolder();
                } else {
                    this.feedService.checkHasFeed(this.globalService.processFeed);
                }
            }
        }
    }

    getFilesFromFilteredFolder() {
        if (this.processfolder) {
            this.globalService.processFeed = false;
            this.getFilesSpecificFolder(this.folderIdSelected).subscribe(
                (successfully: any) => {
                    this.lc.run(() => {
                        if (this.folderTypeSelected == 'folder') {
                            this.specificFoldeFiles = this.specificFoldeFiles.concat(successfully.response_data);
                        } else {
                            this.specificSubFoldeFiles = this.specificSubFoldeFiles.concat(successfully.response_data);
                        }
                        let feedsGroupFiltered;
                        if (this.feedService.filterTypeActive) {
                            feedsGroupFiltered = this.feedService.filteredFeed(successfully.response_data);
                            if (!feedsGroupFiltered.length) {
                                this.getFilesFromFilteredFolder();
                            }
                        } else {
                            feedsGroupFiltered = successfully.response_data
                        }
                        this.globalService.paginateFeeds = this.globalService.paginateFeeds.concat(feedsGroupFiltered);
                        this.globalService.paginateFeedsCache = this.globalService.paginateFeedsCache.concat(successfully.response_data);
                        this.feedService.removeLoadMore(false);
                    });
                    this.globalService.processFeed = true;
                },
                (err: any) => {
                    this.feedService.removeLoadMore(false);
                    this.processfolder = false;
                    console.error(err)
                });
        }
    }

    /*Folder Select2*/
    foldersSelect(data) {
        return $('#upload-folders').select2({
            tags: true,
            tokenSeparators: [',', ' '],
            data: data,
            containerCssClass: 'white-orange',
            dropdownCssClass: 'white-orange',
        }).trigger('change');
    }

    getAllFolderFunct() {
        return new Promise((resolve, reject) => {
            this.getAllFolder().subscribe(
                (successfully: any) => {
                    this.folders = successfully.response_data;
                    this.globalService.finishFolders = true;
                    this.globalService.deleteFolderForm = false;
                    resolve(true);
                },
                (err: any) => {
                    console.log(err)
                });
        });

    }

    reloadPage() {
        this.globalService.filterAnimate();
        this.feedService.refreshPage = true;
        if  (this.channelService.channelSelected !== undefined) {
            this.selectedFolder(this.channelService.channelSelected, this.channelService.channel.id,
                'channel', this.channelService.channel);
        } else {
            this.feedService.checkHasFeed(true, true);
        }
        this.getAllFolderFunct().then();
    }

    filterFeedsLiveFilter(filter: any = {isUpcoming: true, isPassed: true, isLive: true, isOther: true}) {
        this.feedService.filter = 'all';
        this.filterLive = filter;
        this.filterFeeds('live');
    }
}