import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {DirectiveModule} from "../directiveModule/directive.module";
import {HeaderModule} from "../headerModule/header.module";
import {RouterModule} from "@angular/router";
import {ChannelsComponent} from "./channels.component";
import {ChannelsPage} from "../../components/channels/channels.component";
import {ChannelsHeader} from "../../components/header/ChannelsHeader/channels-header.component";
import {LeftColumnModule} from "../leftComunModule/leftColumn.module";

@NgModule({
    bootstrap: [
        ChannelsPage,
        ChannelsHeader
    ],
    declarations: [
        ChannelsPage,
        ChannelsComponent,
        ChannelsHeader
    ],
    entryComponents: [],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        HeaderModule,
        DirectiveModule,
        LeftColumnModule,
        RouterModule.forRoot([
            { path: 'channels',  component: ChannelsComponent }
        ])
    ],
    providers: []
})
export class ChannelsModule {}