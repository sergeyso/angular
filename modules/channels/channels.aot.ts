import { platformBrowser } from '@angular/platform-browser';
import {ChannelsModuleNgFactory} from "../../../aot/resources/assets/angular/app/modules/channels/channels.module.ngfactory";
import {enableProdMode} from "@angular/core";

if(process.env.NODE_ENV === "production")
{
    enableProdMode();
    platformBrowser().bootstrapModuleFactory(ChannelsModuleNgFactory);
}

