import {Component, OnDestroy, OnInit} from '@angular/core';
import {GlobalService} from '../../../services/global.service';
import {RshService} from '../../../services/rsh.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-user-interactions',
    templateUrl: 'user-interactions.html'
})
export class UserInteractionsComponent implements OnInit, OnDestroy  {
    userInteractionContent: boolean = false;
    userInteractionContentValue: string = '';
    subscription: Subscription;

    constructor(
        public globalService: GlobalService,
        public rhsService: RshService
    ) {
        this.subscribeCommentChild();
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        console.log('a');
        this.subscription.unsubscribe();
    }

    popupFileOperations(value) {
        this.userInteractionContent = true;
        this.userInteractionContentValue = value;
    }

    hideCommentsEmmit() {
        this.userInteractionContent = false;
    }

    /**
     * Call subscrube comment
     */
    subscribeCommentChild() {
        this.subscription = this.globalService.commentSubsctiption.asObservable().subscribe (
            success => {
                console.log(success);
                if (success) {
                    this.popupFileOperations('comments');
                }
            }
        );
        this.globalService.commentSubsctiption.complete();
    }
}
