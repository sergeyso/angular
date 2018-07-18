import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {DirectiveModule} from '../directiveModule/directive.module';
import {HeaderModule} from '../headerModule/header.module';
import {RouterModule} from '@angular/router';
import {LeftColumnModule} from '../leftComunModule/leftColumn.module';
import {PostPageModuleComponent} from './post-page.component';
import {PostPageComponent} from '../../components/post-page/post-page.component';
import {PostPageHeaderComponent} from '../../components/header/PostPageHeader/post-page-header.component';
import {PostService} from '../../services/post.service';
import {SectorService} from "../../services/sector.service";

@NgModule({
    bootstrap: [
        PostPageComponent,
        PostPageHeaderComponent
    ],
    declarations: [
        PostPageComponent,
        PostPageModuleComponent,
        PostPageHeaderComponent
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
            { path: 'p/:id',  component: PostPageModuleComponent }
        ])
    ],
    providers: [
        PostService,
        SectorService
    ]
})
export class PostPageModule {

    constructor(
        public postService: PostService
    ) {
        this.post();
    }

    post() {
        this.postService.post = JSON.parse(document.querySelector('app-post-page-component').getAttribute('post'));
        document.querySelector('app-post-page-component').removeAttribute('post');
    }
}