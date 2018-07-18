import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {RshService} from '../../../services/rsh.service';
import {GlobalService} from '../../../services/global.service';
import {ResponseApi} from '../../../models/interfaces/responseApi.interface';

@Component({
    selector: 'app-comments',
    templateUrl: 'comments.html'
})
export class CommentsComponent implements OnInit {
    // Create event emitter to emit click on parent component
    @Output() hideCommentsEmmit: EventEmitter<boolean> = new EventEmitter();
    message: string = '';
    loading: boolean = true;
    showProgress: boolean = false;
    comments: Array<any> = [];
    constructor(
        public rshService: RshService,
        public globalService: GlobalService
    ) {};

    // Close popup and pass value to emitter
    hideComments(): void {
        this.hideCommentsEmmit.emit(false);
    }

    ngOnInit() {
        this.getAllComment();
    }

    getAllComment() {
        this.globalService.getRquest(
            `${this.globalService.apiUrl}files/${this.globalService.rightColumnValueFeed.id}/comments`
        ).subscribe(
            (isSuccess: ResponseApi) => {
                this.comments = isSuccess.response_data;
            }, error2 => {
                this.loading = false
            }, () => {
                this.loading = false
            }
        )
    }

    addComment() {
        this.showProgress = true;
        this.globalService.postRquest(
            `${this.globalService.apiUrl}files/${this.globalService.rightColumnValueFeed.id}/comments`,
            {
                'message': this.message
            }
        ).subscribe(
            isSuccess => {
                this.getAllComment();
            }, error2 => {
                alert('we have some problem to add comment , please try leather');
                this.message = '';
                this.showProgress = false;
            },  () => {
                this.message = '';
                this.showProgress = false;
            }
        )
    }

    deleteComment(index, comment) {
        this.showProgress = true;
        this.globalService.deleteRquest(
            `${this.globalService.apiUrl}files/${this.globalService.rightColumnValueFeed.id}/comments/${comment.id}`
        ).subscribe(
            isSuccess => {
                this.comments.splice(index, 1);
            }, error2 => {
                alert('we have some problem to delete comment , please try leather');
                this.showProgress = false;
            },  () => {
                this.showProgress = false;
            }
        )
    }

    commentSubmit() {
        if(this.message && !this.loading) {
            this.addComment()
        }
    }
}