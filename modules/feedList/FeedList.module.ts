import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {ClipboardModule} from 'ngx-clipboard';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {VideoComponent} from '../../components/feeds/video/video.component';
import {LiveComponent} from '../../components/feeds/live/live.component';
import {ImageComponent} from '../../components/feeds/image/image.component';
import {PdfComponent} from '../../components/feeds/pdf/pdf.component';
import {PinComponent} from '../../components/feeds/pin/pin.component';
import {PopupComponent} from '../../components/popups/popups.component';
import {ImagePopupComponent} from '../../components/popups/image/image.popup.component';
import {VideoPopupComponent} from '../../components/popups/video/video.popup.component';
import {FormsModule} from '@angular/forms';
import {FeedComponent} from '../../components/feeds/feeds.component';
import {ClusterComponent} from '../../components/feeds/cluster/cluster.component';
import {RatingModule} from 'ngx-rating';
import {StartedGuideModule} from '../startedGuideModule/startedGuide.module';

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};
import {ImageGroupComponent} from '../../components/feeds/imageGroup/image-group.component';
import {DirectiveModule} from '../directiveModule/directive.module';
import {DocumentPopupComponent} from '../../components/popups/document/document.popup.component';
import {PdfPopupComponent} from '../../components/popups/pdf/pdf.popup.component';
import {ClusterPopup} from '../../components/popups/cluster/cluster.popup.component';
import {MainFeedFileOperationsComponent} from '../../components/feeds/file-operations/main-feed-file-operations.component';
import {ChoosePdfImage} from '../../components/popups/pdf-choose-image/pdf-choose-image.component';
import {QuestionsComponent} from '../../components/feeds/questions/questions.component';
import {DeleteFile} from '../../components/popups/delete-file/delete-file.component';
import {SearchFilesComponent} from '../../components/searchPage/searchFiles/search-files.component';
import {SimpleTextPost} from '../../components/feeds/simple-text/simpleText.component';
import {LeftColumnModule} from '../leftComunModule/leftColumn.module';
import {UserInteractionsComponent} from '../../components/popups/user-interactions/user-interactions.component';
import {CommentsComponent} from '../../components/popups/comments/comments.component';
import {SearchFoldersComponent} from '../../components/searchPage/searchFolders/search-folders.component';
import {SearchPeopleComponent} from '../../components/searchPage/searchPeople/search-people.component';
import {SearchChannelsComponent} from '../../components/searchPage/searchChannel/search-channel.component';
import {FoldersComponent} from '../../components/feeds/folders/folders.component';
import {AudioComponent} from '../../components/feeds/audio/audio.component';
import {MetadataComponent} from '../../components/popups/metadata/metadata.component';
import {EmptyFeedComponent} from '../../components/feeds/empty-feed/empty-feed.component';
import {FilterLiveComponent} from '../../components/feeds/filter-live/filter-live.component';
import {EditFileComponent} from '../../components/popups/edit-file/edit-file.component';
import {EditPostComponent} from '../../components/popups/edit-post/edit-post.component';
import {SecurityComponent} from "../../components/popups/security/security.component";
import {AddProcessPopupComponent} from "../../components/bottom-target/add-process-popup/add-process-popup.component";

@NgModule({
    declarations: [
        VideoComponent,
        ImageComponent,
        ImageGroupComponent,
        PdfComponent,
        PinComponent,
        PopupComponent,
        ImagePopupComponent,
        VideoPopupComponent,
        FeedComponent,
        ClusterComponent,
        DocumentPopupComponent,
        PdfPopupComponent,
        ClusterPopup,
        MainFeedFileOperationsComponent,
        ChoosePdfImage,
        QuestionsComponent,
        DeleteFile,
        SearchFilesComponent,
        SearchFoldersComponent,
        SearchChannelsComponent,
        SearchPeopleComponent,
        SimpleTextPost,
        UserInteractionsComponent,
        CommentsComponent,
        FoldersComponent,
        AudioComponent,
        MetadataComponent,
        EmptyFeedComponent,
        LiveComponent,
        FilterLiveComponent,
        EditFileComponent,
        EditPostComponent,
        SecurityComponent,
        AddProcessPopupComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
        ClipboardModule,
        RatingModule,
        DirectiveModule,
        LeftColumnModule,
        StartedGuideModule
    ],
    exports: [
        VideoComponent,
        ImageComponent,
        ImageGroupComponent,
        PdfComponent,
        PinComponent,
        PopupComponent,
        ImagePopupComponent,
        VideoPopupComponent,
        FeedComponent,
        ClusterComponent,
        DocumentPopupComponent,
        PdfPopupComponent,
        ClusterPopup,
        MainFeedFileOperationsComponent,
        DeleteFile,
        SearchFilesComponent,
        SearchFoldersComponent,
        SearchChannelsComponent,
        SearchPeopleComponent,
        UserInteractionsComponent,
        CommentsComponent,
        FoldersComponent,
        AudioComponent,
        LiveComponent,
        EditFileComponent,
        EditPostComponent,
        FilterLiveComponent,
        SecurityComponent,
        AddProcessPopupComponent
    ],
    providers: []
})
export class FeedListModule {}