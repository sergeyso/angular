import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {LeftColumn} from '../../components/left-column/left-column.component';
import {FolderColumn} from '../../components/folder-column/folder-column.component';
import {FormsModule} from '@angular/forms';
import {DeleteFolder} from '../../components/folder-column/delete-folder/delete-folder.component';
import {RatingModule} from 'ngx-rating';
const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

import {ContactColumn} from '../../components/contact-column/contact-column.component';
import {IngestTypesManage} from '../../components/popups/ingestTypesManage/ingest-types-manage.component';
import {DirectiveModule} from '../directiveModule/directive.module';
import {LeftFirstColumn} from '../../components/left-column/leftFirstColumn/left-first-column.component';
import {EmbedWidgetLeftCol} from '../../components/popups/embedWidgetLeftCol/embed-widget-lc.component';
import {RatingComponent} from '../../components/popups/channels/channels-preview/channels-rating/ratingcomponent';
import {TabContent} from '../../components/popups/channels/channels-preview/channel-tabs/tab-content/tab-content.component';
import {TabsComponent} from '../../components/popups/channels/channels-preview/channel-tabs/tabs-copmonent/tabs-component.component';
import {ChannelInfo} from '../../components/popups/channels/channels-preview/channel-info/channel-info';
import {ChannelSimilar} from '../../components/popups/channels/channels-preview/channels-similarpart/channels-similar.component';
import {ChannelTopInfo} from '../../components/popups/channels/channels-preview/channel-topinfo/channel-topinfo';
import {ChannelsSlider} from '../../components/popups/channels/channels-preview/channels-slider/channels-slider.component';
import {ChannelSubscribe} from '../../components/popups/channels/channels-preview/channel-subscribe/channel-subscribe';
import {ChannelsPreview} from '../../components/popups/channels/channels-preview/channels-preview.component';
import {GetAppsComponent} from '../../components/popups/getApps/get-apps.component';
import {FilterPipe} from '../../pipes/filter.pipe';
import {MeetingsColumnComponent} from '../../components/meetings-column/meetings-column.component';
import {LeftNewAccountFirstStep} from '../../components/popups/new-account-first-step/new-account-first-step.component';
import {ShareFilePopupComponent} from '../../components/popups/share-file/share-file.component';
import {ShareButtonsModule} from 'ngx-sharebuttons';
import {AddNewChannelPopup} from '../../components/popups/channels/add-new-channel/add-new-channel';
import {LoadingIconComponent} from '../../components/feeds/loading-icon/loading-icon.component';
import {CompanyImageDirective} from '../../directive/company-image.directive';
import {DeleteDialogComponent} from '../../components/popups/delete-dialog/delete-dialog.component';

import {AccountTooltipsComponent} from '../../components/left-column/account-tooltips/account-tooltips.component';
import {PersonalAccountTooltipComponent} from '../../components/left-column/account-tooltips/personal-account-tooltip/personal-account.component';
import {OrganisationAccountTooltipComponent} from '../../components/left-column/account-tooltips/organisation-account-tooltip/organisation-account.component';
import {ReminderAccountTooltipComponent} from '../../components/left-column/account-tooltips/reminder-account-tooltip/reminder-account.component';
import {VaultColumnComponent} from "../../components/vault-column/vault-column.component";
import {SettingsDropboxPopupComponent} from "../../components/bottom-target/settings-dropbox-popup/settings-dropbox.component";
import {ConnectVaultPopupComponent} from "../../components/popups/connect-vault/connect-vault.component";
import {VaultService} from "../../services/vault.service";
import {VaultModalComponent} from "../../components/popups/vault-modal/vault-modal.component";

@NgModule({
    declarations: [
        LeftColumn,
        LeftFirstColumn,
        FolderColumn,
        DeleteFolder,
        ChannelsPreview,
        RatingComponent,
        TabContent,
        TabsComponent,
        ChannelInfo,
        ChannelSimilar,
        ChannelTopInfo,
        ChannelsSlider,
        ChannelSubscribe,
        ContactColumn,
        IngestTypesManage,
        EmbedWidgetLeftCol,
        GetAppsComponent,
        FilterPipe,
        MeetingsColumnComponent,
        VaultColumnComponent,
        LeftNewAccountFirstStep,
        ShareFilePopupComponent,
        AddNewChannelPopup,
        LoadingIconComponent,
        CompanyImageDirective,
        DeleteDialogComponent,
        AccountTooltipsComponent,
        PersonalAccountTooltipComponent,
        OrganisationAccountTooltipComponent,
        ReminderAccountTooltipComponent,
        SettingsDropboxPopupComponent,
        ConnectVaultPopupComponent,
        VaultModalComponent,
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
        RatingModule,
        DirectiveModule,
        ShareButtonsModule.forRoot()
    ],
    exports: [
        LeftColumn,
        LeftFirstColumn,
        FolderColumn,
        DeleteFolder,
        ChannelsPreview,
        RatingComponent,
        TabContent,
        TabsComponent,
        ChannelsSlider,
        ChannelInfo,
        ChannelSimilar,
        ChannelTopInfo,
        ChannelsSlider,
        ChannelSubscribe,
        ContactColumn,
        IngestTypesManage,
        EmbedWidgetLeftCol,
        GetAppsComponent,
        FilterPipe,
        MeetingsColumnComponent,
        AddNewChannelPopup,
        LoadingIconComponent,
        DeleteDialogComponent,
        ShareFilePopupComponent,
        AccountTooltipsComponent,
        PersonalAccountTooltipComponent,
        OrganisationAccountTooltipComponent,
        ReminderAccountTooltipComponent,
        SettingsDropboxPopupComponent,
        ConnectVaultPopupComponent,
        VaultModalComponent,
    ],
    providers: [
        VaultService
    ]
})
export class LeftColumnModule {}
