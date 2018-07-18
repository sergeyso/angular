import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {GlobalService} from "../../../services/global.service";


@Component({
    selector: 'cluster-component',
    templateUrl: 'cluster.html'
})
export class ClusterComponent {
    showClusterAlbumPopup:boolean = false;

    //Pass this value in parent component
    @Output() showCluster = new EventEmitter();
    @Input() value: any;
    @Input() index: any;
    key: number = 0;

    constructor(
        public global: GlobalService,
    ) {}

    //Hide popup here
    hideCluster() {
        this.showCluster.emit(false);
    }

    showClusters(key) {
        this.key = key;
        this.showClusterAlbumPopup = !this.showClusterAlbumPopup;
    }

    hideClusterPopUp(event) {
        this.showClusterAlbumPopup = event;
    }
}