import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {GlobalService} from "../../services/global.service";
import {ProfilePage} from "../../components/profilePageComponent/profile-page.component";
import {FeedListModule} from "../feedList/FeedList.module";
import {FeedService} from "../../services/feeds.service";
import {RightColumnModule} from "../rightColumnComponent/rightColumt.module";
import {LeftColumnModule} from "../leftComunModule/leftColumn.module";
import {HeaderModule} from "../headerModule/header.module";
import {ProfileHeader} from "../../components/header/ProfileHeader/profile-header.component";
import {SendFileComponent} from "../../components/popups/sendFileComponent/send-file.component";
import {DirectiveModule} from "../directiveModule/directive.module";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {ProfileComponent} from "./profile.component";
import {PopupComponent} from "../../components/popups/popups.component";
@NgModule({
    bootstrap: [
        ProfilePage,
        ProfileHeader
    ],
    declarations: [
        ProfileComponent,
        ProfilePage,
        ProfileHeader,
        SendFileComponent
    ],
    entryComponents: [],
    imports: [
        BrowserModule,
        FormsModule,
        HeaderModule,
        FeedListModule,
        RightColumnModule,
        LeftColumnModule,
        DirectiveModule,
        RouterModule.forRoot([
            { path: 'profile',  component: ProfileComponent },
            { path: 'profile/:id',  component: ProfileComponent },
            { path: 'c/:id',  component: PopupComponent },
        ])
    ],
    providers: []
})
export class ProfileModule {
    constructor(
        private globalService: GlobalService,
        private feedService: FeedService
    ) {
        this.profileUser();
        this.profileFeedUrl();
        this.headerPart();
    }

    private profileUser() {
        this.globalService.currentUser = JSON.parse(document.querySelector('profile').getAttribute('user'));
        document.querySelector('profile').removeAttribute('user');
    }

    private profileFeedUrl() {
        this.feedService.url = document.querySelector('profile').getAttribute('url');
        document.querySelector('profile').removeAttribute('url');
    }

    private headerPart() {
        this.globalService.headerPart = 'profile';
    }

}