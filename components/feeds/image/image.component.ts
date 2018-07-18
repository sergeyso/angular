import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {GlobalService} from "../../../services/global.service";

@Component({
    selector: 'image-component',
    templateUrl: 'image.html'
})
export class ImageComponent {
    ShowClusterVar:boolean = false;
    loadingClusters:boolean = false;
    newPopupVisible:boolean = false;
    clusters: Array<any> = [];
    @Input() value: any;
    @Input() index: any;
    @Output() showPopupComponent = new EventEmitter();

    constructor(
        public global: GlobalService,
    ) {}

    showClusterHide(event) {
        this.ShowClusterVar = event;
    }

    // Show cluster
    showCluster() {
        this.checkClusters();
    }

    checkClusters() {
        if(!this.value.hasOwnProperty('clusters')) {
            this.loadingClusters = true;
            this.global.getRquest(this.global.apiUrl+'files/search', {
                'per-page': '5',
                "filter[inusercity]": 1,
                "filter[noself]": 1,
                "filter[filetype][]": 'image',
                "filter[created_to]": this.value.create_time,
                "filter[created_from]": this.value.create_time - 86400,
            }).subscribe(
                (successfully: Response) => {
                    this.value.clusters = successfully.response_data;
                    this.loadingClusters = false;
                    this.ShowClusterVar = true
                }, (error: any) => {
                    this.loadingClusters = false;
                    this.ShowClusterVar = false;
                    console.error(error);
                }
            );
        } else {
            this.ShowClusterVar = true
        }
    }

    /**
     * Open new popup
     */
    openNewPopup() {
        this.newPopupVisible = true;
    }

    /**
     * Show comments
     * @param value
     * @param index
     */
    showComments(value, index) {
        this.showPopupComponent.emit(
            {
                value: value,
                index: index
            }
        );
    }

}
