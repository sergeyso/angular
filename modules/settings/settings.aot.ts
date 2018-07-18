import { platformBrowser } from '@angular/platform-browser';
import {SettingsModuleNgFactory} from "../../../aot/resources/assets/angular/app/modules/settings/settings.module.ngfactory";
import {enableProdMode} from "@angular/core";

if(process.env.NODE_ENV === "production")
{
    enableProdMode();
    platformBrowser().bootstrapModuleFactory(SettingsModuleNgFactory);
}