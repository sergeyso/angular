import {Component, Input} from '@angular/core';
import {GlobalService} from '../../../services/global.service';


@Component({
    selector: 'app-audio-component',
    templateUrl: 'audio.html'
})
export class AudioComponent {
    @Input() value: any;
    @Input() index: any;
    constructor(
        public global: GlobalService,
    ) {}
}
