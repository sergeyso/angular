import {Component} from '@angular/core';
import {GlobalService} from "../../services/global.service";
import {RshService} from "../../services/rsh.service";

@Component({
    selector: 'right-column',
    templateUrl: 'right-column.html'
})
export class RightColumn {
    constructor(
        public globalService: GlobalService,
        public rhsService: RshService
    ) {}
}