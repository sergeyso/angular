import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GlobalService} from "../../../services/global.service";
import {UsersService} from "../../../services/users.service";
import * as moment from 'moment';

@Component({
    selector: 'live-component',
    templateUrl: 'live.html'
})
export class LiveComponent {

    @Input() value: any;
    @Input() index: any;
    @Output() showPopupComponent = new EventEmitter();

    countdownId: any;
    countdown: any = `
        <li>00<span>HOURS</span></li>
        <li>00<span>MINUTES</span></li>
        <li>00<span>SECONDS</span></li>`;
        
    participants: Array<any> = [];
    invites: Array<any> = [];

    constructor(
        public global: GlobalService,
        public usersService: UsersService,
    ) {}

    ngOnInit() {
        if (this.live.isUpcoming) {
            if (this.countdownId) {
                clearInterval(this.countdownId);
            }
            this.countdownId = setInterval(this.countdownTick.bind(this), 1000);
        }
        var userIds = [];
        this.invites = Object.keys(this.value.invites);
        Object.keys(this.value.access.users).forEach((objectKey) => {
            if (parseInt(objectKey) !== this.global.login.data.id) {
                userIds.push(objectKey);
            }
        });
        if (userIds.length) {
            this.usersService.getUsersId(userIds).subscribe(
                (successfully: Response) => {
                    let users = successfully.response_data;
                    users.forEach((user) => {
                        user.firstLetter = user.username.charAt(0);
                        user.avatarSmall = user.avatarUrl;
                        if (user.avatarUrl) {
                            user.avatarSmall = user.avatardata.encodings.length ? user.avatardata.encodings[0].uri : false;
                        }
                        this.participants.push(user);
                    });
                }, (error: any) => {
                    console.error(error);
                }
            );
        }
    }

    /**
     * Show comments
     * @param value
     * @param index
     */
    showComments(value, index) {
        this.showPopupComponent.emit(
            {
                value: value,
                index: index
            }
        );
    }

    get live(): any {
        return this.value.filedata.live;
    }

    get url(): string {
        return this.global.appUrl + '/live/' + this.value.id;
    }

    get beginAtFormatted(): string {
        return moment.utc(this.live.begin_at * 1000).format('MMM D YYYY, HH:mm')
    }

    countdownTick() {
        var timeLeft = this.live.begin_at * 1000 - Date.now();
        timeLeft = timeLeft >= 0 ? timeLeft : 0;
        var DDD: any = (parseInt(moment.utc(timeLeft).format('DDD')) - 1);
        DDD = DDD >= 10 ? DDD : '0' + DDD.toString();
        var parts = moment.utc(timeLeft).format(DDD + ' : HH : mm : ss').split(' : ');
        this.countdown = `
        <li>${parts[0]}<span>DAYS</span></li>
        <li>${parts[1]}<span>HOURS</span></li>
        <li>${parts[2]}<span>MINUTES</span></li>
        <li>${parts[3]}<span>SECONDS</span></li>`;
    }
}