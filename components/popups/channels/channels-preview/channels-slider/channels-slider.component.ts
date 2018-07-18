import { Component, AfterViewInit} from '@angular/core';

@Component({
    selector: 'slider',
    templateUrl: 'channels-slider.html'
})
export class ChannelsSlider implements AfterViewInit{
    flexslider() {
        $('.channel-flexslider').flexslider({
            animation: "slide",
            directionNav: false,
            start: function(){
                $('.flexslider-slide-container img').show();
            },
        });
    }
    ngAfterViewInit() {
       this.flexslider();
    }
}