/**
 * Created by t_mit on 2/6/2017.
 */
import {Directive, TemplateRef, ViewContainerRef, Input} from '@angular/core';
import {GlobalService} from "../services/global.service";

@Directive({
    selector: '[checkAuth]',
})

export class CheckAuth {
    constructor(
        private templateRef: TemplateRef<any>,
        private view: ViewContainerRef,
        private global: GlobalService
    ) {}

    @Input() set checkAuth(file) {
        try {
            this.view.clear();
            if (this.global.isOwnerFile(file)) {
                this.view.createEmbeddedView(this.templateRef);
            }
        } catch (e) {
            // Else remove template from DOM
            this.global.itsOwner = false;
        }
    }
}