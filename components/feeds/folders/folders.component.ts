import {Component} from '@angular/core';
import {GlobalService} from '../../../services/global.service';


@Component({
    selector: 'app-folders-component',
    templateUrl: 'folders.html'
})
export class FoldersComponent {
    constructor(
        public global: GlobalService,
    ) {}
}