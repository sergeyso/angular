import {Component} from '@angular/core';

@Component({
    selector: "rating-component",
    templateUrl: 'rating.html'
})
export class RatingComponent {
    starsCount: number = 3;
}