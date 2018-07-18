import {Component, OnInit, ViewChild} from '@angular/core';
import {GlobalService} from '../../services/global.service';
import {PostService} from '../../services/post.service';
import {ResponseApi} from '../../models/interfaces/responseApi.interface';

@Component({
    selector: 'app-post-page-component',
    templateUrl: 'post-page.html'
})
export class PostPageComponent implements OnInit {
    @ViewChild('postContainerMainDesc') postContanerMainDesc;
    message: string = '';
    loading: boolean = true;
    showProgressPost: boolean = false;
    comments: Array<any> = [];

    /**
     * @param {GlobalService} globalService
     * @param {PostService} postService
     */
    constructor(
        public globalService: GlobalService,
        public postService: PostService
    ) {}

    ngOnInit() {
        this.getAllComment();
        this.postContanerMainDesc.nativeElement.innerHTML = this.postService.post.text;
    }

    getAllComment() {
        this.globalService.getRquest(
            `${this.globalService.apiUrl}posts/${this.postService.post.id}/comments`,
            {},
            !this.globalService.login
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
        this.showProgressPost = true;
        this.globalService.postRquest(
            `${this.globalService.apiUrl}posts/${this.postService.post.id}/comments`,
            {
                'message': this.message
            }
        ).subscribe(
            isSuccess => {
                this.getAllComment();
            }, error2 => {
                alert('we have some problem to add comment , please try leather');
                this.message = '';
                this.showProgressPost = false;
            },  () => {
                this.message = '';
                this.showProgressPost = false;
            }
        )
    }

    deleteComment(index, comment) {
        this.showProgressPost = true;
        this.globalService.deleteRquest(
            `${this.globalService.apiUrl}posts/${this.postService.post.id}/comments/${comment.id}`
        ).subscribe(
            isSuccess => {
                this.comments.splice(index, 1);
            }, error2 => {
                alert('we have some problem to delete comment , please try leather');
                this.showProgressPost = false;
            },  () => {
                this.showProgressPost = false;
            }
        )
    }

    commentSubmitPost() {
        if (this.message && !this.loading) {
            this.addComment()
        }
    }
}
