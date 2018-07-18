import {NgModule} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {GlobalService} from '../../services/global.service';
import {FolderService} from '../../services/folder.service';
import {FeedService} from '../../services/feeds.service';
import {LiveService} from '../../services/live.service';
import {UploadService} from '../../services/uploadFile.service';
import {RshService} from '../../services/rsh.service';
import {UsersService} from '../../services/users.service';
import {DirectiveModule} from '../directiveModule/directive.module';
import {MainHeaderComponent} from '../../components/header/MainHeader/main-header.component';
import {ChannelService} from '../../services/channel.service';
import {HeaderSearchForm} from '../../components/header/HeaderSearchForm/header-search-form';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {DragService} from '../../services/dragService.service';
import {CheckHeaderImageDirective} from '../../directive/check-header-image.directive';

@NgModule({
    declarations: [
        MainHeaderComponent,
        HeaderSearchForm,
        CheckHeaderImageDirective
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        DirectiveModule
    ],
    exports: [
        MainHeaderComponent,
        HeaderSearchForm
    ],
    providers: [
        RshService,
        GlobalService,
        FolderService,
        FeedService,
        LiveService,
        UploadService,
        UsersService,
        ChannelService,
        DragService
    ]
})
export class HeaderModule {
    constructor(
        private globalService: GlobalService,
        private folderService: FolderService,
        private channelsService: ChannelService,
        public location: Location,
    ) {
        this.login();
        this.folders();
        this.channels();
        this.contacts();
        this.getRoute();
    }

    private login() {
        this.globalService.login = JSON.parse(document.querySelector('header-app').getAttribute('login'));
        document.querySelector('header-app').removeAttribute('login');
    }

    private folders() {
        this.folderService.setFolders();
        // this.folderService.folders = JSON.parse(document.querySelector('header-app').getAttribute('folders'));
        // document.querySelector('header-app').removeAttribute('folders');
    }

    private channels() {
        this.channelsService.setChannels();
        this.channelsService.setSettingsChannels();
        // this.channelsService.channels = JSON.parse(document.querySelector('header-app').getAttribute('channels'));
        // document.querySelector('header-app').removeAttribute('channels');
    }

    private contacts() {
        this.globalService.setContacts();
        // this.globalService.contacts = JSON.parse(document.querySelector('header-app').getAttribute('contacts'));
        // document.querySelector('header-app').removeAttribute('contacts');
    }

    private getRoute() {
        const route = this.location.path().split('?')[0];
        if (route && route != '/explanation') {
            this.globalService.currentRoute = this.location.path().split('?')[0];
        } else {
            this.globalService.currentRoute = '/';
        }
    }
}