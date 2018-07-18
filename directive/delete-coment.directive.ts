/**
 * Created by t_mit on 2/6/2017.
 */
import {Directive, TemplateRef, ViewContainerRef, Input} from '@angular/core';
import {GlobalService} from "../services/global.service";

@Directive({
    selector: '[deleteComment]',
})

export class DeleteCommentDirective {
    constructor(
        private templateRef: TemplateRef<any>,
        private view: ViewContainerRef,
        private globalService: GlobalService
    ) {}

    @Input() set deleteComment(comment) {
        try {
            this.view.clear();
            if (
                this.globalService.rightColumnValueFeed.user.id === this.globalService.login.data.id
                || comment.user.id === this.globalService.login.data.id) {
                this.view.createEmbeddedView(this.templateRef);
            }
        } catch (e) {
        }
    }
}