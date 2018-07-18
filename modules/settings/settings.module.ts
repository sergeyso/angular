import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {GlobalService} from '../../services/global.service';
import {SettingsPage} from '../../components/settingsPageComponent/settings-page.component';
import {SettingsTabComponent} from '../../components/settingsPageComponent/settingstab-content/settingstab-content.component';
import {SettingsGeneral} from '../../components/settingsPageComponent/settingsGeneral/settings-genneral.component';
import {ProfileSettings} from '../../components/settingsPageComponent/profileSettings/profile-settings.component';
import {BillingSettings} from '../../components/settingsPageComponent/settingsBilling/settings-billing.component';
import {TransactionsSettings} from '../../components/settingsPageComponent/settingsTransactions/settings-transactions.component';
import {ChannelSettings} from '../../components/settingsPageComponent/channelSettings/channel-settings.component';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {IntegrationsSettingsComponent} from '../../components/settingsPageComponent/settingsIntegrations/settings-integrations.component';
import {YoutubeBoxComponent} from '../../components/settingsPageComponent/settingsIntegrations/youtubeBoxComponent/youtube-box.component';
import {VimeoBoxComponent} from '../../components/settingsPageComponent/settingsIntegrations/VimeoBoxComponent/vimeo-box.component';
import {DailymotionBoxComponent} from '../../components/settingsPageComponent/settingsIntegrations/DailymonthBoxComponent/dailymonth-box.component';
import {MonetizationBoxChannel} from '../../components/settingsPageComponent/channelSettings/monetizationBoxChannels/monetization-box-channel.component';
import {LeftColumnModule} from '../leftComunModule/leftColumn.module';
import {HeaderModule} from '../headerModule/header.module';
import {SettingsHeader} from '../../components/header/SettingsHeader/settings-header.component';
import {ChannelService} from '../../services/channel.service';
import {VaultService} from '../../services/vault.service';
import {ChannelFilesIdsDirective} from '../../directive/filesSelectedInChannel';
import {DirectiveModule} from '../directiveModule/directive.module';
import {RemoveUserNumberSeatsComponent} from '../../components/popups/settingspopups/remove-user/remove-user-number-seats.component';
import {RouterModule} from '@angular/router';
import {SettingsComponent} from './settings.component';
import {FacebookService} from '../../services/facebook.service';
import {EqualValidator} from '../../directive/customValidation/equal.validator';
import {FollowSettings} from '../../components/settingsPageComponent/settingsFollow/settings-follow.component';
import {ChannelFoldersSettings} from '../../components/settingsPageComponent/settingsChanelsandFolders/settings-chanelsFolders.component';
import {CustomSettings} from '../../components/settingsPageComponent/CustomSettings/custom-settings.component';
import {AffiliateSettings} from '../../components/settingsPageComponent/settingsAffiliates/settings-affiliate.component';
import {SettingsSubscriptions} from '../../components/settingsPageComponent/settingsSubsciptions/settings-subscriptions.component';
import {ResellerSettings} from '../../components/settingsPageComponent/settingsReseller/reseller.component';

import {MyDatePickerModule} from 'mydatepicker';
import {SectorService} from "../../services/sector.service";
import {SettingsService} from "../../services/settings.service";

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};
@NgModule({
    bootstrap: [
        SettingsComponent,
        SettingsHeader
    ],
    declarations: [
        SettingsComponent,
        SettingsPage,
        SettingsTabComponent,
        SettingsGeneral,
        ProfileSettings,
        BillingSettings,
        TransactionsSettings,
        ChannelSettings,
        IntegrationsSettingsComponent,
        MonetizationBoxChannel,
        YoutubeBoxComponent,
        VimeoBoxComponent,
        DailymotionBoxComponent,
        SettingsHeader,
        ChannelFilesIdsDirective,
        RemoveUserNumberSeatsComponent,
        EqualValidator,
        FollowSettings,
        ChannelFoldersSettings,
        CustomSettings,
        AffiliateSettings,
        SettingsSubscriptions,
        ResellerSettings,
    ],
    entryComponents: [],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        HeaderModule,
        LeftColumnModule,
        DirectiveModule,
        PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
        RouterModule.forRoot([
            { path: 'settings',  component: SettingsPage },
        ]),
        MyDatePickerModule
    ],
    providers: [
        FacebookService,
        SectorService,
        VaultService,
        SettingsService
    ]
})
export class SettingsModule {
    constructor(
        private globalService: GlobalService,
        private channelService: ChannelService,
    ) {
        this.headerPart();
        this.channel();
        this.target();
        this.countries();
        this.files();
        this.removePathFromUrl();
        this.inviteUsers();
    }

    private headerPart() {
        this.globalService.headerPart = 'settings';
    }

    private channel() {
        if (document.querySelector('settings').getAttribute('channel')) {
            this.globalService.selectedTapSettings = 5;
        }
        document.querySelector('settings').removeAttribute('channel');
    }

    private target() {
        if (document.querySelector('settings').getAttribute('target')) {
            this.globalService.selectedSettingsTab = document.querySelector('settings').getAttribute('target');
        }
        document.querySelector('settings').removeAttribute('target');
    }

    private countries() {
        this.channelService.setCountries();
    }

    private files() {
        this.channelService.setFilesFromChannel();
    }

    private inviteUsers() {
        this.globalService.setInvitesUsers()
    }

    private removePathFromUrl() {
        window.history.pushState('{}', '', '/'+window.location.href.substring(window.location.href.lastIndexOf('/') + 1).split('?')[0]);
    }
}