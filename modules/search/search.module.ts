import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {GlobalService} from '../../services/global.service';
import {FeedListModule} from '../feedList/FeedList.module';
import {SearchPage} from '../../components/searchPage/search-page.component';
import {SearchFilterComponent} from '../../components/searchPage/searchFilter/search-filter.component';
import {ChannelsComponent} from '../../components/feeds/channels/channels.component';
import {RightColumnModule} from '../rightColumnComponent/rightColumt.module';
import {LeftColumnModule} from '../leftComunModule/leftColumn.module';
import {HeaderModule} from '../headerModule/header.module';
import {SearchHeader} from '../../components/header/SearchHeader/search-header.component';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SearchComponent} from './search.component';
import {PopupComponent} from '../../components/popups/popups.component';
@NgModule({
    bootstrap: [
        SearchPage,
        SearchHeader
    ],
    declarations: [
        SearchComponent,
        SearchPage,
        SearchHeader,
        SearchFilterComponent,
        ChannelsComponent,
    ],
    entryComponents: [],
    imports: [
        BrowserModule,
        FormsModule,
        HeaderModule,
        FeedListModule,
        RightColumnModule,
        LeftColumnModule,
        RouterModule.forRoot([
            { path: 'search',  component: SearchComponent },
            { path: 'c/:id',  component: PopupComponent },
        ])
    ],
    providers: []
})
export class SearchModule {
    constructor(
        private globalService: GlobalService,
    ) {
        this.headerPart();
        this.search();
        this.tag();
    }

    private search() {
        this.globalService.search = document.querySelector('app').getAttribute('search');
        document.querySelector('app').removeAttribute('search');
    }

    private tag() {
        this.globalService.searchTag = document.querySelector('app').getAttribute('tag');
        document.querySelector('app').removeAttribute('tag');
    }

    private headerPart() {
        this.globalService.headerPart = 'search';
    }
}