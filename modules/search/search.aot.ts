import { platformBrowser } from '@angular/platform-browser';
import { SearchModuleNgFactory } from "../../../aot/resources/assets/angular/app/modules/search/search.module.ngfactory";
import {enableProdMode} from "@angular/core";

if(process.env.NODE_ENV === "production")
{
    enableProdMode();
    platformBrowser().bootstrapModuleFactory(SearchModuleNgFactory);
}