import {Component} from '@angular/core';
import {GlobalService} from "../../../services/global.service";


@Component({
    selector: 'pin-component',
    templateUrl: 'pin.html'
})
export class PinComponent {

    constructor(
        public global: GlobalService,
    ) {}
}