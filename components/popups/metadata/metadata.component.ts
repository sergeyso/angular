import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {RshService} from '../../../services/rsh.service';
import {GlobalService} from '../../../services/global.service';

@Component({
    selector: 'popup-metadata',
    templateUrl: 'metadata.html'
})
export class MetadataComponent implements OnInit {
    @Output() hideCommentsEmmit: EventEmitter<boolean> = new EventEmitter();
    loading: boolean = true;
    userObservable: any;
    metadataObject: any = {};
    constructor(
        public rhsService: RshService,
        public globalService: GlobalService,
    ) {}

    ngOnInit() {
        this.getMetadata()
    }

    // Close popup and pass value to emitter
    hideComments(): void {
        this.hideCommentsEmmit.emit(false);
    }

    getMetadata() {
        try {
            this.userObservable = {};
            this.metadataObject = {};
            this.loading = true;
            this.globalService.getRquest(`${this.globalService.apiUrl}files/${this.globalService.rightColumnValueFeed.id}`).subscribe(
                (success: Response) => {
                    this.userObservable = this.menageObject(success);
                    this.metadataObject = this.putObject();
                    this.loading = false;
                }, error2 => {
                    this.userObservable = {
                        error : error2
                    };
                    this.loading = false;
                }
            );
        } catch (e) {
            this.userObservable = {
                error : 'empty'
            }
        }
    }

    private menageObject(success) {
        if (Object.keys(success.response_data.filedata.metadata).length > 0) {
            return success.response_data.filedata.metadata;
        }
        return {
            error : 'Metadata is not generate at the moment.'
        }
    }

    putObject() {
        return {
            description: this.globalService.rightColumnValueFeed.description,
            tags: this.globalService.rightColumnValueFeed.tags.join(),
            imageFormat: this.getImageFormat(),
            imageDimension: this.getImageDimension(),
            clipArttype: this.getClipArttype(),
            lineDrawingType: this.getLineDrawingType(),
            adultContent: this.getAdultContent(),
            racyContent: this.getRacyContent(),
            blackAndWhite: this.getBlackAndWhite(),
            dominantColorBackground: this.getDominantColorBackground(),
            dominantColorForeground: this.getDominantColorForeground(),
            faces: this.getFaces(),
        }
    }

    /**
     * @returns {string}
     */
    getDescription() {
        try {
            return this.userObservable.description.captions[0].text;
        } catch (e) {
            return ''
        }
    }

    /**
     * @returns {string}
     */
    getTags() {
        try {
            const tags: Array<string> = [];
            this.userObservable.tags.forEach(value => {
                tags.push(value.name);
            });
            return tags.join();
        } catch (e) {
            return ''
        }
    }

    getImageFormat() {
        try {
            return this.userObservable.metadata.format;
        } catch (e) {
            return ''
        }
    }

    getImageDimension() {
        try {
            return `${this.userObservable.metadata.width}x${this.userObservable.metadata.height}`;
        } catch (e) {
            return ''
        }
    }

    getClipArttype() {
        try {
            return this.userObservable.imageType.clipArtType;
        } catch (e) {
            return ''
        }
    }

    getLineDrawingType() {
        try {
            return this.userObservable.imageType.lineDrawingType;
        } catch (e) {
            return ''
        }
    }

    getAdultContent() {
        try {
            if (!this.userObservable.adult.isAdultContent) {
                return 'No';
            }
            return this.userObservable.adult.isAdultContent;
        } catch (e) {
            return ''
        }
    }

    getRacyContent() {
        try {
            if (!this.userObservable.adult.isRacyContent) {
                return 'No';
            }
            return this.userObservable.adult.isRacyContent;
        } catch (e) {
            return ''
        }
    }

    getBlackAndWhite() {
        try {
            if (!this.userObservable.color.isBWImg) {
                return 'No';
            }
            return this.userObservable.color.isBWImg;
        } catch (e) {
            return ''
        }
    }

    getDominantColorBackground() {
        try {
            return this.userObservable.color.dominantColorBackground;
        } catch (e) {
            return ''
        }
    }

    getDominantColorForeground() {
        try {
            return this.userObservable.color.dominantColorForeground;
        } catch (e) {
            return ''
        }
    }

    getFaces() {
        try {
            return `${this.userObservable.faces[0].gender} (${this.userObservable.faces[0].age})`;
        } catch (e) {
            return 'None'
        }
    }
}
