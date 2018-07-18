import {Directive, TemplateRef, ViewContainerRef, Input} from '@angular/core';

@Directive({
    selector: '[checkArray]',
})

export class CheckGroupFeeds {
    constructor(
        private templateRef: TemplateRef<any>,
        private view: ViewContainerRef
    ) {}

    @Input() set checkArray(condition) {
        if(Array.isArray(condition)) {
            this.view.createEmbeddedView(this.templateRef);
        }
    }
}
