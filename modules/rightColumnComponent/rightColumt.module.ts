import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {HttpModule} from "@angular/http";
import {RightColumn} from "../../components/right-column/right-column.component";
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};
import {OptionsForFilesComponent} from "../../components/right-column/optionsForFiles/options-for-files.component";
import {MonetizationComponent} from "../../components/right-column/monetizationComponent/monetization-component.component";
import {DirectiveModule} from "../directiveModule/directive.module";
import {PaymentLicence} from "../../components/right-column/buyLicence/payment_licence";
import {UpdateContentComponent} from "../../components/right-column/UpdateContentSection/update-content.component";
import {RightColumnFile} from "../../components/right-column/file/right-file-column.component";
import {RightColumnFolder} from "../../components/right-column/folder/right-folder-column.component";
import {ShareFileComponent} from "../../components/right-column/ShareComponent/share-file.component";
import {SharedService} from "../../services/shared.service";
import {ShareButtonsModule} from "ngx-sharebuttons";
import {ColorPickerModule} from "ngx-color-picker";
import {VersionsComponent} from "../../components/right-column/VersionsComponent/versions.component";
import {SharedFolderRightColumn} from "../../components/right-column/folder/sharedFolder/shared-folder.component";
import {AddLicenceComponent} from "../../components/right-column/licence/addLicence/addLicence-component.component";
import {BuyLicenceComponent} from "../../components/right-column/licence/buyLicence/buyLicence-component.component";
import {LicenceService} from "../../services/licence.service";
import {MetadataComponent} from "../../components/right-column/metadata/Metadata";

@NgModule({
    declarations: [
        RightColumn,
        OptionsForFilesComponent,
        MonetizationComponent,
        PaymentLicence,
        UpdateContentComponent,
        RightColumnFile,
        RightColumnFolder,
        ShareFileComponent,
        VersionsComponent,
        SharedFolderRightColumn,
        AddLicenceComponent,
        BuyLicenceComponent,
        MetadataComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
        DirectiveModule,
        ShareButtonsModule.forRoot(),
        ColorPickerModule,
        ReactiveFormsModule
    ],
    exports: [
        RightColumn,
        OptionsForFilesComponent,
        MonetizationComponent,
        UpdateContentComponent,
        PaymentLicence,
        RightColumnFile,
        RightColumnFolder,
        ShareFileComponent,
        VersionsComponent,
        SharedFolderRightColumn,
        AddLicenceComponent,
        BuyLicenceComponent,
        MetadataComponent
    ],
    providers: [
        SharedService,
        LicenceService
    ]
})
export class RightColumnModule {}