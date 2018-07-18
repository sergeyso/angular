import { platformBrowser } from '@angular/platform-browser';

import {enableProdMode} from "@angular/core";
import {VaultModuleNgFactory} from "../../../aot/resources/assets/angular/app/modules/vaultModule/vault.module.ngfactory";

if(process.env.NODE_ENV === "production")
{
    enableProdMode();
    platformBrowser().bootstrapModuleFactory(VaultModuleNgFactory);
}