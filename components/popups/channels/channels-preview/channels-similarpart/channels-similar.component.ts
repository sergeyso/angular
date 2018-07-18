import { Component, AfterViewInit} from '@angular/core';

@Component({
    selector: 'channel-similar',
    templateUrl: 'channels-similar.html'
})
export class ChannelSimilar implements AfterViewInit{
    flexslider() {
        $('.channel-flexslider-similar').flexslider({
            animation: "slide",
            animationLoop: false,
            itemWidth: 220,
            itemMargin: 3,
            controlNav: false
        });
    }
    ngAfterViewInit() {
        this.flexslider();
    }
}