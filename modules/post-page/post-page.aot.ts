import { platformBrowser } from '@angular/platform-browser';
import {PostPageModuleNgFactory} from '../../../aot/resources/assets/angular/app/modules/post-page/post-page.module.ngfactory';
import {enableProdMode} from '@angular/core';

if (process.env.NODE_ENV === 'production') {
    enableProdMode();
    platformBrowser().bootstrapModuleFactory(PostPageModuleNgFactory);
}

