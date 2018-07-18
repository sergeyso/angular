import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {GlobalService} from '../../services/global.service';
import {HeaderModule} from '../headerModule/header.module';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {VaultPageComponent} from "../../components/vaultPage/vault-page.component";
import {VaultHeaderComponent} from "../../components/header/VaultHeader/vault-header.component";
import {VaultComponent} from "./vault.component";
import {VaultLeftColumnComponent} from "../../components/vaultPage/leftColumn/vault-left-column.component";
import {PerfectScrollbarConfigInterface, PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {DirectiveModule} from "../directiveModule/directive.module";
import {LeftColumnModule} from "../leftComunModule/leftColumn.module";
import {VaultFolderComponent} from "../../components/vaultPage/leftColumn/vault-folder/vault-folder.component";
import {VaultService} from "../../services/vault.service";
import {SharedService} from "../../services/shared.service";
import {FeedModule} from "../feed/feed.module";
import {FileProcessingPopupComponent} from "../../components/vaultPage/file-processing-popup/file-processing.component";
const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {};

@NgModule({
    bootstrap: [
        VaultComponent,
        VaultHeaderComponent
    ],
    declarations: [
        VaultComponent,
        VaultHeaderComponent,
        VaultPageComponent,
        VaultLeftColumnComponent,
        VaultFolderComponent,
        FileProcessingPopupComponent
    ],
    entryComponents: [],
    imports: [
        BrowserModule,
        FormsModule,
        HeaderModule,
        DirectiveModule,
        LeftColumnModule,
        FeedModule,
        RouterModule.forRoot([{ path: 'vault',  component: VaultPageComponent }]),
        PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG)
    ],
    providers: [
        VaultService,
        SharedService
    ]
})
export class VaultModule {

}
