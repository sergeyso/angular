import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {GlobalService} from '../../services/global.service';
import {FolderService} from '../../services/folder.service';
import {DirectiveModule} from '../directiveModule/directive.module';
import {AnswerComponent} from '../../components/popups/answer/answer.component';


@NgModule({
    declarations: [
        AnswerComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        DirectiveModule
    ],
    exports: [
        AnswerComponent
    ],
    providers: [
        GlobalService,
        FolderService,
    ]
})
export class AddAnswerModule {}
