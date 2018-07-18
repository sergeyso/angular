import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LinkFolder} from '../../../../models/class/folder/LinkFolder';

@Component({
    selector: 'add-new-link',
    templateUrl: 'add-new-link.html'
})
export class AddNewLinkShareFolderComponent implements OnInit{
    @Input() link: LinkFolder;
    @Input() index;
    @Input() submitLinks;
    // Create event emitter to emit click on parent component
    @Output() sendIndex: EventEmitter<boolean> = new EventEmitter();

    ngOnInit() {
        this.link['first'] = true;
    }
    /**
     * Delete Link
     */
    deleteLink() {
        this.sendIndex.emit(this.index)
    }
}