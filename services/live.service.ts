import {Injectable} from '@angular/core';
import {GlobalService} from './global.service';
import {Observable} from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class LiveService {
    public upcomingUrl = `${this.globalService.apiUrl}files/live/upcoming`;
    public passedUrl = `${this.globalService.apiUrl}files/live/passed`;
    public upcomingEvents: Array<any> = [];
    public pastEvents: Array<any> = [];
    public upcomingLoader: boolean = false;
    public pastLoader: boolean = false;
    public upcomingPaginationCurrentPage: any;
    public upcomingPaginationPageCount: any;
    public pastPaginationCurrentPage: any;
    public pastPaginationPageCount: any;
    public pastPaginationTotalCount: any;
    private countdownId: any;

    constructor(
        public globalService: GlobalService,
    ) {
        this.upcomingLoader = true;
    }

    loadUpcoming(page = 1) {
        if (page == 1) {
            this.upcomingEvents = [];
        }
        this.globalService.getRequestPagination(this.upcomingUrl, {
            'per-page': '50',
            'page': page
        }).subscribe(
            (response: Response) => {
                let successfully: any = response.json();
                this.upcomingPaginationCurrentPage = response.headers.get('x-pagination-current-page');
                this.upcomingPaginationPageCount = response.headers.get('x-pagination-page-count');

                let events = successfully.response_data;
                events.forEach((event) => {
                    event.url = this.globalService.appUrl + '/live/' + event.id;
                    event.live = event.filedata.live;
                    event.isOwner = this.globalService.login.data.id === event.user_id;
                    this.upcomingEvents.push(event);
                });

                this.countdownStart();
                this.upcomingLoader = false;
            }, (error: any) => {
                console.error(error);
                this.upcomingLoader = false;
            }
            );
    }

    loadPast(page = 1) {
        if (page == 1) {
            this.pastEvents = [];
        }
        this.globalService.getRequestPagination(this.passedUrl, {
            'per-page': '50',
            'page': page
        }).subscribe(
            (response: Response) => {
                let successfully: any = response.json();
                this.pastPaginationCurrentPage = response.headers.get('x-pagination-current-page');
                this.pastPaginationPageCount = response.headers.get('x-pagination-page-count');
                this.pastPaginationTotalCount = response.headers.get('x-pagination-total-count');

                let events = successfully.response_data;
                events.forEach((event) => {
                    this.pastEvents.push(event);
                });

                this.pastLoader = false;
            }, (error: any) => {
                console.error(error);
                this.pastLoader = false;
            }
            );
    }

    loadNextUpcoming() {
        if (this.upcomingPaginationCurrentPage === this.upcomingPaginationPageCount) {
            return false;
        }
        var current = parseInt(this.upcomingPaginationCurrentPage, 10)
        var next = current ? current + 1 : 1;
        return this.loadUpcoming(next);
    }

    loadNextPast() {
        if (this.pastPaginationCurrentPage === this.pastPaginationPageCount) {
            return false;
        }
        var current = parseInt(this.pastPaginationCurrentPage, 10)
        var next = current ? current + 1 : 1;
        return this.loadPast(next);
    }

    private countdownStart() {
        if (this.countdownId) {
            clearInterval(this.countdownId);
        }
        this.countdownId = setInterval(this.countdownTick.bind(this), 1000);
    }

    private countdownTick() {
        var now = Date.now();
        this.upcomingEvents.forEach((event) => {
            var timeLeft = event.filedata.live.begin_at * 1000 - now;
            timeLeft = timeLeft >= 0 ? timeLeft : 0;
            var DDD: any = (parseInt(moment.utc(timeLeft).format('DDD')) - 1);
            DDD = DDD >= 10 ? DDD : '0' + DDD.toString();
            event.countdown = moment.utc(timeLeft).format(DDD + ' : HH : mm : ss');
        });
    }

}