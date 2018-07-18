import { platformBrowser } from '@angular/platform-browser';
import {FeedModuleNgFactory} from "../../../aot/resources/assets/angular/app/modules/feed/feed.module.ngfactory";
import {enableProdMode} from "@angular/core";

if(process.env.NODE_ENV === "production")
{
    enableProdMode();
    platformBrowser().bootstrapModuleFactory(FeedModuleNgFactory);
}