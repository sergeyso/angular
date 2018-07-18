import {Component} from '@angular/core';
import {RshService} from "../../../services/rsh.service";

@Component({
    selector: 'versions',
    templateUrl: 'versions.html'
})
export class VersionsComponent {
    constructor(
        public rhsService: RshService
    ) { }
}