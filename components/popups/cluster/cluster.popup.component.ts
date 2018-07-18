import {Component, AfterViewInit, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {GlobalService} from "../../../services/global.service";

@Component({
    selector: 'cluster-popups',
    templateUrl: 'cluster.popup.html',
    styleUrls: ['cluster.popup.scss']
})
export class ClusterPopup implements AfterViewInit, OnInit{

    @Input() value: any;
    @Input() key: number;
    @Output() close = new EventEmitter();
    targetImage: any;

    images:Array<any> = [];

    constructor(
        public globalService: GlobalService
    ) { }

    ngOnInit() {
        this.getImage();
    }

    getImage() {
        try {
            this.targetImage = this.value.clusters[this.key];
        } catch (e) {
            this.targetImage = this.value.clusters[0];
        }
    }

    flexsliderCarousel() {
        let _this = this;
        $('#carousel').flexslider({
            animation: "fade",
            controlNav: false,
            directionNav: false,
            slideshow: false,
            itemWidth: 90,
            asNavFor: '#slider',
            maxItems: 4,
            prevText: "",
            nextText: "",
            startAt: _this.key
        });
    };

    flexsliderSlides() {
        let _this = this;
        $('#slider').flexslider({
            animation: "fade",
            controlNav: false,
            directionNav: false,
            direction: "vertical",
            slideshow: false,
            sync: "#carousel",
            prevText: "",
            nextText: "",
            startAt: _this.key
        });
    };
    ngAfterViewInit() {
        this.flexsliderCarousel();
        this.flexsliderSlides();
    }

    hideCluster() {
        this.close.emit(false);
    }

    getKeySlider(key) {
        try {
            this.targetImage = this.value.clusters[key];
        } catch (e) {
            this.targetImage = this.value.clusters[0];
        }
    }
}