import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {FormsModule} from '@angular/forms';
import {RatingModule} from 'ngx-rating';

import {StartedGuideComponent} from '../../components/started-guide/started-guide.component';
import {AskQuestionComponent} from "../../components/started-guide/ask-question-popup/ask-question.component";
import {ChromePluginComponent} from "../../components/started-guide/chrome-plugin-popup/chrome-plugin.component";
import {ConnectVaultComponent} from "../../components/started-guide/connect-vault-popup/connect-vault.component";
import {CreateMeetingComponent} from "../../components/started-guide/create-meeting-popup/create-meeting.component";
import {CreatePostComponent} from "../../components/started-guide/create-post-popup/create-post.component";
import {MobileAppsComponent} from "../../components/started-guide/mobile-apps-popup/mobile-apps.component";
import {SetupChannelsComponent} from "../../components/started-guide/setup-channels-popup/setup-channels.component";
import {SetupFoldersComponent} from "../../components/started-guide/setup-folders-popup/setup-folders.component";
import {UnderstandPrivacyComponent} from "../../components/started-guide/understand-privacy-popup/understand-privacy.component";
import {UploadContentComponent} from "../../components/started-guide/upload-content-popup/upload-content.component";
import {InviteContactsComponent} from "../../components/started-guide/invite-contacts-popup/invite-contacts.component";
import {SectorService} from "../../services/sector.service";
import {PreloadDialogComponent} from "../../components/started-guide/preload-dialog-popup/preload-dialog.component";

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    declarations: [
        StartedGuideComponent,
        AskQuestionComponent,
        ChromePluginComponent,
        ConnectVaultComponent,
        CreateMeetingComponent,
        CreatePostComponent,
        MobileAppsComponent,
        SetupChannelsComponent,
        SetupFoldersComponent,
        UnderstandPrivacyComponent,
        UploadContentComponent,
        InviteContactsComponent,
        PreloadDialogComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
        RatingModule,
    ],
    exports: [
        StartedGuideComponent,
        AskQuestionComponent,
        ChromePluginComponent,
        ConnectVaultComponent,
        CreateMeetingComponent,
        CreatePostComponent,
        MobileAppsComponent,
        SetupChannelsComponent,
        SetupFoldersComponent,
        UnderstandPrivacyComponent,
        UploadContentComponent,
        InviteContactsComponent,
        PreloadDialogComponent
    ],
    providers: [
        SectorService
    ]
})
export class StartedGuideModule {}