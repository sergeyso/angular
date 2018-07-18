import {Component, Input} from '@angular/core';
import {GlobalService} from '../../../services/global.service';


@Component({
    selector: 'feed-question-component',
    templateUrl: 'questions.html'
})
export class QuestionsComponent {
    @Input() value: any;
    @Input() index: any;
    constructor(
        public global: GlobalService,
    ) {}
}
