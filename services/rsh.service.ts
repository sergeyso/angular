/**
 * Created by toni on 4.2.17.
 */
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class RshService {
    protectedDetailsVisible:boolean = false;
    detailsViewIsVisible:boolean = true;
    columtActive:string = '';
    disabledLoadingIcon: boolean = false;
    subject: BehaviorSubject<string> = new BehaviorSubject('');
    shareSubject: BehaviorSubject<string> = new BehaviorSubject('');
    explanationStepFourVisible: boolean = false;
    constructor () {}


    showColumn(value) {
        if(this[value] !== undefined) {
            this[value]();
        }
        this.columtActive = value;
        this.detailsViewIsVisible = false;
        if(this.columtActive == 'share') {
            this.explanationStepFourVisible = true;
        }
    }

    hideColumt() {
        this.columtActive = '';
        this.detailsViewIsVisible = true;
    }

    comment() {
        this.subject.next('comment');
    }


    share() {
        this.shareSubject.next('share');
    }


}