import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {GlobalService} from '../../services/global.service';
import {MainColumn} from '../../components/main-column/main-column.component';
import {FeedListModule} from '../feedList/FeedList.module';
import {FolderService} from '../../services/folder.service';
import {RightColumnModule} from '../rightColumnComponent/rightColumt.module';
import {LeftColumnModule} from '../leftComunModule/leftColumn.module';
import {UploadFormComponent} from '../../components/upload-form/upload-form.component';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {HeaderModule} from '../headerModule/header.module';
import {FeedHeaderMainComponent} from '../../components/header/FeedPageHeader/header-feed-main';
import {FeedHeaderComponent} from '../../components/header/FeedPageHeader/feed/header-feed-page';
import {UploadHeaderComponent} from '../../components/header/FeedPageHeader/upload/header-upload-main';
import {UploadLimit} from '../../components/popups/uploadLimit/upload-limit-popup.component';
import {ActivatedRoute, Params, RouterModule} from '@angular/router';
import {PopupComponent} from '../../components/popups/popups.component';
import {FeedComponentApp} from './feed.component';
import {NotificationComponent} from '../../components/notification/notifications';
import {PrivacyUploadFiles} from '../../components/popups/upload_file_privacy/privacy-upload-files.component';
import {BottomTargetComponent} from '../../components/bottom-target/bottom-target.component';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};
import {ClipboardModule} from 'ngx-clipboard';
import {LiveSetupComponent} from '../../components/popups/live-setup-popup/live-setup.component';
import {EmailReminder} from '../../components/popups/live-setup-popup/emailReminder/email-reminder.component';
import {MyDatePickerModule} from 'mydatepicker';
import {AskQuestionComponent} from '../../components/popups/ask-question/ask-question.component';
import {AddAnswerFilesComponent} from '../../components/popups/add-answer-files/add-answer-files.component';
import {ShareFolderPopup} from '../../components/popups/share-folder/share-folder.component';
import {FreeAccountError} from '../../components/popups/free-account-error/free-account-error.component';
import {AddNewLinkShareFolderComponent} from '../../components/popups/share-folder/add-new-link/add-new-link.component';
import {FilterChannels} from '../../pipes/filter-channels.pipe';
import {DirectiveModule} from '../directiveModule/directive.module';
import {UploadFormAddContent} from '../../components/popups/upload-form-add-content/upload-form-add-content.component';
import {UploadFormAddRecordComponent} from '../../components/popups/upload-form-add-record/upload-form-add-record.component';
import {RecordAudioComponent} from '../../components/popups/recordAudio/recordAudio.component';
import {RecordVideoComponent} from '../../components/popups/recordVideo/recordVideo.component';
import {CountdownComponent} from '../../components/countdown/countdown.component';
import {RecordScreenComponent} from '../../components/popups/recordScreen/recordScreen.component';
import {DateTimePickerComponent} from '../../components/datetimepicker/datetimepicker.component';
import {FileUploadModule} from "ng2-file-upload";
import {VaultService} from "../../services/vault.service";
import {UploadFileFormComponent} from "../../components/upload-form/upload-file-form/upload-file-form.component";
import {PostService} from "../../services/post.service";
import {ChannelService} from "../../services/channel.service";

@NgModule({
    bootstrap: [
        MainColumn,
        FeedHeaderMainComponent
    ],
    declarations: [
        MainColumn,
        UploadFormComponent,
        UploadFileFormComponent,
        FeedHeaderMainComponent,
        FeedHeaderComponent,
        UploadHeaderComponent,
        UploadLimit,
        FeedComponentApp,
        NotificationComponent,
        PrivacyUploadFiles,
        BottomTargetComponent,
        LiveSetupComponent,
        CountdownComponent,
        DateTimePickerComponent,
        EmailReminder,
        AskQuestionComponent,
        AddAnswerFilesComponent,
        ShareFolderPopup,
        AddNewLinkShareFolderComponent,
        FreeAccountError,
        FilterChannels,
        UploadFormAddContent,
        UploadFormAddRecordComponent,
        RecordAudioComponent,
        RecordVideoComponent,
        RecordScreenComponent
    ],
    entryComponents: [],
    imports: [
        BrowserModule,
        HttpModule,
        HeaderModule,
        FormsModule,
        FeedListModule,
        RightColumnModule,
        LeftColumnModule,
        DirectiveModule,
        FileUploadModule,
        PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
        ClipboardModule,
        MyDatePickerModule,
        RouterModule.forRoot([
            {path: '', component: FeedComponentApp},
            {path: 'c/:id', component: PopupComponent}
        ])
    ],
    providers: [
        VaultService,
        PostService
    ],
    exports: [
        ShareFolderPopup,
        AddNewLinkShareFolderComponent
    ]
})
export class FeedModule {
    constructor(private globalService: GlobalService,
                private folderService: FolderService,
                private channelService: ChannelService) {
        this.headerPart();
        this.uploadFormat();
        this.removePathFromUrl();
        this.upload();
        this.folderSelect();
        this.file();
    }

    private headerPart() {
        this.globalService.headerPart = 'feeds';
    }

    private uploadFormat() {
        this.globalService.uploadForm = true;
    }

    private removePathFromUrl() {
        const channelId: any = new URL(location.href).searchParams.get('channel');
        this.channelService.channelSelected = channelId === null ? undefined : Number(channelId);
        window.history.pushState('{}', '', '/' + window.location.href.substring(window.location.href.lastIndexOf('/') + 1).split('?')[0]);
    }

    private upload() {
        if (document.querySelector('app') && document.querySelector('app').getAttribute('upload')) {
            setTimeout(() => {
                this.globalService.showUploadForm = true;
                this.globalService.headerPart = 'upload';
            }, 1);
            document.querySelector('app').removeAttribute('upload');
        }
    }

    folderSelect() {
        if (document.querySelector('app') && document.querySelector('app').getAttribute('folderSelect') !== '[]') {
            this.folderService.folderSelectedObject = JSON.parse(document.querySelector('app').getAttribute('folderSelect'));
            this.folderService.folderSelectedBoolean = true;
            document.querySelector('app').removeAttribute('folderSelect');
        }
    }

    file() {
        if (document.querySelector('app')) {
            this.globalService.file = JSON.parse(document.querySelector('app').getAttribute('file'));
            document.querySelector('app').removeAttribute('file');
        }
    }
}
