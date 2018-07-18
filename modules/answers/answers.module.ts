import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {GlobalService} from '../../services/global.service';
import {FeedListModule} from '../feedList/FeedList.module';
import {RightColumnModule} from '../rightColumnComponent/rightColumt.module';
import {LeftColumnModule} from '../leftComunModule/leftColumn.module';
import {HeaderModule} from '../headerModule/header.module';
import {FormsModule} from '@angular/forms';
import {AnswersPage} from '../../components/answersPage/answers-page.component';
import {AnswersHeader} from '../../components/header/AnswersHeader/answers-header.component';
import {AnswerModuleComponent} from './answers.component';
import {RouterModule} from '@angular/router';
import {AddAnswerModule} from '../add-answer-module/header.module';
import {DirectiveModule} from '../directiveModule/directive.module';

@NgModule({
    bootstrap: [
        AnswersPage,
        AnswersHeader
    ],
    declarations: [
        AnswerModuleComponent,
        AnswersHeader,
        AnswersPage
    ],
    entryComponents: [],
    imports: [
        BrowserModule,
        FormsModule,
        HeaderModule,
        FeedListModule,
        RightColumnModule,
        LeftColumnModule,
        RouterModule.forRoot([
            { path: 'q/:id',  component: AnswersPage }
        ]),
        AddAnswerModule,
        DirectiveModule
    ],
    providers: []
})
export class AnswerModule {
    constructor(
        private globalService: GlobalService,
    ) {
        this.headerPart();
        this.question();
    }

    private headerPart() {
        this.globalService.headerPart = 'answer';
    }

    private question() {
        this.globalService.question = JSON.parse(document.querySelector('app').getAttribute('question'));
        document.querySelector('app').removeAttribute('question');
    }
}
