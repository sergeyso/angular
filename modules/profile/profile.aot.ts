import { platformBrowser } from '@angular/platform-browser';
import {ProfileModuleNgFactory} from "../../../aot/resources/assets/angular/app/modules/profile/profile.module.ngfactory";
import {enableProdMode} from "@angular/core";

if(process.env.NODE_ENV === "production")
{
    enableProdMode();
    platformBrowser().bootstrapModuleFactory(ProfileModuleNgFactory);
}