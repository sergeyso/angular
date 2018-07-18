import {Component, Input} from '@angular/core';
import {GlobalService} from "../../../services/global.service";


@Component({
    selector: 'image-group-component',
    templateUrl: 'image-group.html'
})
export class ImageGroupComponent {

    @Input() value: any;

    @Input() index: any;

    constructor(
        public global: GlobalService,
    ) {}
}