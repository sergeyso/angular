import {Component, AfterViewInit, ViewChild} from '@angular/core';
import {GlobalService} from "../../../services/global.service";
import {RshService} from "../../../services/rsh.service";
import {File} from "../../../models/class/file.model";
import {UploadService} from "../../../services/uploadFile.service";
import {NgForm} from "@angular/forms";
import {ValidationForm} from "../../../helpers/validation";

@Component({
    selector: 'update-content',
    templateUrl: 'update-content.html'
})
export class UpdateContentComponent implements AfterViewInit {
    file: File = new File();
    idsSelectedTags: Array<any> = [];
    @ViewChild('updateChanges') updateChanges: NgForm;
    showProgress: boolean = false;
    constructor(
        public globalService: GlobalService,
        public rhsService: RshService,
        protected uploadService: UploadService
    ) {
        this.updateUserObject()
    }

    tagsVar:any;

    ngAfterViewInit() {
/*        this.tagsSelect();
        this.tagsOnChange();*/
    }

    onSubmit() {
        try {
            ValidationForm.checkValid(this.updateChanges);
            if (this.updateChanges.valid) {
                this.showProgress = true;
                this.updateFileMethod();
            }
        } catch (e) {
            document.location.href="/";
        }
    }

    private updateFileMethod() {
        this.uploadService.updateFile(this.file).subscribe(
            (update: Response) => {
                this.showProgress = false;
                this.rhsService.hideColumt();
                this.globalService.rightColumnValueFeed = update.response_data[0];
                this.updateGlobalFeedArray(update.response_data[0]);
            },
            (err: any) => {
                console.log('errol');
            });
    }

    /**
     * 002 Change when filtration will be server side
     * Update Global
     * Updated with new Group
     */
    private updateGlobalFeedArray(newValue) {
        let currentFeed = this.globalService.paginateFeeds[this.globalService.indexFile];
        if(currentFeed.file_type == 'imagegroup') {
            let newArray = currentFeed.filedata.map((item) => {
                if(item.id == this.globalService.rightColumnValueFeed.id) {
                    return newValue;
                } else {
                    return item
                }
            });
            currentFeed.filedata = newArray;
            this.globalService.paginateFeeds[this.globalService.indexFile] = currentFeed;
        } else {
            this.globalService.paginateFeeds[this.globalService.indexFile] = newValue;
        }
    }

    /*Tags*/
    private tagsSelect() {
        let tags = $('#tags');
        this.tagsVar = tags.select2({
            data: this.file.addTags,
            placeholder: "Add tag",
            allowClear: true,
            tags: true,
            tokenSeparators: [',', ' '],
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange"
        });
        tags.val(this.idsSelectedTags).trigger("change");
    }

    private tagsOnChange() {
        this.tagsVar.on('change', (e: any) => {
            this.file.addTags = JSON.stringify($(e.target).val());
        });
    }

    private updateUserObject() {
        this.file.id = this.globalService.rightColumnValueFeed.id;
        this.file.name = this.globalService.rightColumnValueFeed.name;
        this.file.description = this.globalService.rightColumnValueFeed.description;
/*        this.file.addTags = this.tagSelect2Compile();*/

    }

    tagSelect2Compile() {
        let array = [];
        this.globalService.rightColumnValueFeed.tags.forEach((a,e) => {
            array.push({
                id: a.id,
                text: a.name
            });
            this.idsSelectedTags.push(a.id);
        });
        return array;
    }
}