import { platformBrowser } from '@angular/platform-browser';
import { AnswerModuleNgFactory } from "../../../aot/resources/assets/angular/app/modules/answers/answers.module.ngfactory";
import {enableProdMode} from "@angular/core";

if(process.env.NODE_ENV === "production")
{
    enableProdMode();
    platformBrowser().bootstrapModuleFactory(AnswerModuleNgFactory);
}