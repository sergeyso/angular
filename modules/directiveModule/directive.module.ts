import {NgModule} from '@angular/core';
import {FolderOffsetDirective} from '../../directive/folderoffset.directive';
import {FolderSelect2Directive} from '../../directive/folders.select2.directive';
import {UserImageDirective} from '../../directive/checkUserImage.directive';
import {FeedImageDirective} from '../../directive/checkFeedImage.directive';
import {CheckClickDirective} from '../../directive/clickOutside.directive';
import {DiffTimeFeedDirective} from '../../directive/diffTime.directive';
import {CheckGroupFeeds} from '../../directive/feedGroupCheck.directive';
import {CheckAuth} from '../../directive/checkAuth.directive';
import {RightColumnOffset} from '../../directive/rightColOffset.directive';
import {EmailValidator} from '../../directive/customValidation/email.validator';
import {DraggableDirective} from '../../directive/dragDrop/draggableDirective.directive';
import {DropTargetDirective} from '../../directive/dragDrop/dropTargetDirective.directive';
import {ChannelImageDirective} from '../../directive/checkChannelImage.directive';
import {SpecificNumberPipe} from '../../pipes/showSpecificNumber.pipe';
import {LinkValidatorDirective} from '../../directive/customValidation/links.validator';
import {PopupHeightDirective} from '../../directive/popup-height.directive';
import {DeleteCommentDirective} from '../../directive/delete-coment.directive';
import {ShareNumberDirective} from '../../directive/shareNumber.directive';
import {ClickStopPropagationDirective} from "../../directive/clickStopPropagation";

@NgModule({
    declarations: [
        FolderOffsetDirective,
        FolderSelect2Directive,
        RightColumnOffset,
        UserImageDirective,
        FeedImageDirective,
        CheckClickDirective,
        DiffTimeFeedDirective,
        CheckGroupFeeds,
        CheckAuth,
        EmailValidator,
        DraggableDirective,
        DropTargetDirective,
        ChannelImageDirective,
        SpecificNumberPipe,
        LinkValidatorDirective,
        PopupHeightDirective,
        DeleteCommentDirective,
        ShareNumberDirective,
        ClickStopPropagationDirective
    ],
    imports: [],
    exports: [
        FolderOffsetDirective,
        FolderSelect2Directive,
        RightColumnOffset,
        UserImageDirective,
        FeedImageDirective,
        CheckClickDirective,
        DiffTimeFeedDirective,
        CheckGroupFeeds,
        CheckAuth,
        EmailValidator,
        DraggableDirective,
        DropTargetDirective,
        ChannelImageDirective,
        SpecificNumberPipe,
        LinkValidatorDirective,
        PopupHeightDirective,
        DeleteCommentDirective,
        ShareNumberDirective,
        ClickStopPropagationDirective
    ],
    providers: []
})
export class DirectiveModule {}
