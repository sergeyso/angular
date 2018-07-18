/**
 * Created by t_mit on 1/16/2017.
 */
import {Injectable, NgZone} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {GlobalService} from './global.service';
import {ResponseSearchInterface} from '../models/interfaces/search/response-search.interface';
import {ObjectConstructSearch} from '../models/interfaces/search/objectConstructSearch';
import {ChannelService} from "./channel.service";

@Injectable()
export class FeedService {
    public url = 'files/search';  // URL to web api
    public searchUrl = `${this.globalService.apiUrl}search`;
    load: boolean = false;
    public page: number = 0;
    filterTypeActive: string = '';
    filter: string = 'all';
    refreshPage: boolean = false;
    privacyFeed: number;
    newArray: Array<any>;
    searchResult: ResponseSearchInterface = new ResponseSearchInterface();
    channelsCount: number = 0;
    peoplesCount: number = 0;
    foldersCount: number = 0;
    filesCount: number = 0;

    /**
     * @param http
     * @param globalService
     * @param lc
     */
    constructor(private http: Http,
                private globalService: GlobalService,
                private channelService: ChannelService,
                public lc: NgZone) {
    }

    public getAllFeeds(search = null) {
        this.page = this.page + 1;
        const headers = new Headers();
        this.createAuthorizationHeader(headers);
        const url = this.getUrl(search);
        return this.http.get(url, {
            headers: headers,
            params: this.loopFilters()
        })
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getAllSearchResults() {
        const headers = new Headers();
        this.createAuthorizationHeader(headers);
        const url = `${this.globalService.apiUrl}search` + '?query=' + this.globalService.search + '&page=1&per-page=' + 60;
        return this.http.get(url, {
            headers: headers,
            params: this.loopFilters()
        })
            .map(this.extractData)
            .catch(this.handleError);
    }

    public filesSelf(page) {
        const headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(this.globalService.apiUrl + 'files/self?page=' + page, {
            headers: headers
        })
            .map(this.extractData)
            .catch(this.handleError);
    }

    loopFilters() {
        if (this.filter === 'all' || this.filter === 'peoples' || this.filter === 'channels' || this.filter === 'folders') {
            return;
        }

        return `filter[filetype]=${this.filter}`;

    }

    /**
     * @param search
     * @returns {string}
     */
    private getUrl(search) {
        if (this.globalService.searchTag) {
            return this.searchUrl + '?query=' + this.globalService.searchTag + '&page=' + this.page + '&per-page=' + 60;
        } else if (this.globalService.headerPart === 'search') {
            return this.searchUrl + '?query=' + this.globalService.search + '&page=' + this.page + '&per-page=' + 60;
        } else if (this.globalService.headerPart === 'profile') {
            return `${this.url}page=${this.page}`;
        } else if (this.filter === 'all') {
            return `${this.globalService.apiUrl}files/feed?page=${this.page}`;
        }
        return `${this.globalService.apiUrl}${this.url}?page=${this.page}`;
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

    private createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', 'Basic ' +
            btoa(this.globalService.login.credentials[0] + ':' + this.globalService.login.credentials[1]));
    }

    deleteFeed(...array) {
        const headers = new Headers();
        this.createAuthorizationHeader(headers);

        const url = this.globalService.apiUrl + `${array[1]}s/` + array[0];
        return this.http.delete(url, {
            headers: headers
        })
            .map(this.extractData)
            .catch(this.handleError);
    }


    /**
     * 002 Change when filtration will be server side
     * @param open
     * @param page
     * Updated with new group
     */
    checkHasFeed(open = false, page = false) {
        if (this.channelService.channelSelected !== undefined) {
            this.globalService.processFeed = false;
            return;
        }
        this.getAllSearchResults().subscribe(
            (feeds: any) => {
                const data = feeds.response_data;
                this.channelsCount = data.channels.count;
                this.peoplesCount = data.peoples.count;
                this.foldersCount = data.folders.count;
                this.filesCount = data.files.count;
            }
        );

        if (page) {
            this.page = 0;
        }
        if (
            (!this.globalService.paginateFeeds.length && open === false) ||
            (this.globalService.paginateFeeds.length && open === true) ||
            this.refreshPage === true ||
            (open === true && this.globalService.headerPart === 'search')
        ) {
            this.refreshPage = false;
            this.getAllFeeds().subscribe(
                (feeds: any) => {
                    if (this.globalService.headerPart === 'search') {
                        this.listFieldSearch(feeds.response_data);
                    } else {
                        this.headTypeFeeds(feeds.response_data);
                    }

                    this.removeLoadMore(false);
                    this.globalService.finishFeed = true;

                    if (!feeds.response_data.length) {
                        this.globalService.processFeed = false;
                    }
                },
                (error: any) => {
                    this.removeLoadMore(false);
                    this.globalService.processFeed = false;
                    this.globalService.finishFeed = true;
                    if (this.page === 1) {
                        this.globalService.paginateFeeds = [];
                        this.globalService.paginateFeedsCache = [];
                    }
                    console.error(error);
                }
            );
        } else {
            this.load = false;
        }
    }

    /**
     * Head Type Feeds
     * @param feedsGroup
     */
    headTypeFeeds(feedsGroup) {
        if (this.filterTypeActive) {
            const feedsGroupFiltered = this.filteredFeed(feedsGroup);
            this.listFeed(feedsGroupFiltered);
            if (!feedsGroupFiltered.length) {
                this.checkHasFeed(this.globalService.processFeed);
            }
        } else {
            const finishedFeed = this.listFeed(feedsGroup);
            if (this.globalService.paginateFeeds.length < 5 && finishedFeed) {
                this.checkHasFeed(this.globalService.processFeed);
            }
        }

        this.listFeedCache(feedsGroup);
    }

    private listFieldSearch(data: Array<any>) {
        const checkFilter = this.checkFilter();
        const reconfigureData: ResponseSearchInterface = this.prepareObject(data);
        if (this.page === 1) {
            this.searchResult = reconfigureData;
        } else {
            this.searchResult[checkFilter].data.push(...reconfigureData[checkFilter].data);
            this.searchResult[checkFilter].count = this.searchResult[checkFilter].data.length;
        }
        if (this.filter !== 'all' && this.searchResult[`${checkFilter}`].count < 60 && this.globalService.processFeed) {
            this.checkHasFeed(this.globalService.processFeed);
        }
    }

    /**
     * @param data
     * @returns {ResponseSearchInterface}
     */
    private prepareObject(data) {
        const object: ResponseSearchInterface = new ResponseSearchInterface();
        if (this.filter !== 'all') {
            object[`${this.checkFilter()}`] = new ObjectConstructSearch(
                data.length,
                data
            );

            return object;
        }
        this.globalService.processFeed = false;
        return data
    }

    /**
     * @returns {any}
     */
    private checkFilter() {
        if (this.filter === 'image' || this.filter === 'video' || this.filter === 'office' || this.filter === 'pdf') {
            return 'files'
        }
        return this.filter;
    }

    listFeed(feedsGroup) {
        this.lc.run(() => {
            if (this.page === 1) {
                this.globalService.paginateFeeds = feedsGroup;
            } else {
                this.globalService.paginateFeeds = this.globalService.paginateFeeds.concat(feedsGroup);
            }
        });

        return true
    }

    listFeedCache(feedsGroup) {
        if (this.page === 1) {
            this.globalService.paginateFeedsCache = feedsGroup;
        } else {
            this.globalService.paginateFeedsCache = this.globalService.paginateFeedsCache.concat(feedsGroup);
        }
    }

    public removeLoadMore(value: boolean) {
        this.lc.run(() => {
            this.load = value;
        });
    }

    /**
     * 002 Change when filtration will be server side
     * @param value
     * Updated with new group
     */
    filteredFeed(value) {
        return value.filter((el) => {
            if (this.filterTypeActive === 'image') {
                if (el.file_type === 'image' || el.file_type === 'imagegroup') {
                    return el;
                }
            } else {
                if (el.file_type === this.filterTypeActive) {
                    return el
                }
            }
        });
    }

    /**
     * Search Action
     * @param value
     */
    onSubmitSearch(value) {
        this.globalService.filterAnimate();
        this.checkPathname(value);
    }

    /**
     * Check url
     * @param searchSelected
     */
    private checkPathname(searchSelected) {
        if (window.location.pathname === '/search') {
            this.refreshPage = true;
            this.globalService.processFeed = true;
            this.globalService.searchTag = '';
            this.globalService.search = searchSelected;
            this.checkHasFeed(true, true);
        } else {
            document.location.href = '/search?search=' + searchSelected;
        }
    }
}
