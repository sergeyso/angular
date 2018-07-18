import {Component, Input, ViewChild, OnInit} from '@angular/core';
import {GlobalService} from '../../../services/global.service';


@Component({
    selector: 'simple-text',
    templateUrl: 'simpleText.html'
})
export class SimpleTextPost implements OnInit{
    @Input() value: any;
    @Input() index: any;
    @ViewChild('simpleTextPost') simpleTextPost;
    constructor(
        public global: GlobalService,
    ) {}

    ngOnInit() {
        this.simpleTextPost.nativeElement.innerHTML = this.value.text;
    }

    getFileUrl(file: any) {
        try {
            if (file.file_type == 'video' && file.filedata.encodings.length > 0)
                return file.filedata.encodings[file.filedata.encodings.length - 1].uri;

            return file.filedata.link;
        } catch (e) {
            return file.filedata.link;
        }
    }

    openLink () {
        window.location.href = this.value.short_url;
    }
}