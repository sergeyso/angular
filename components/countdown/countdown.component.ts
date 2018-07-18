import { Component, Input, OnInit, OnChanges } from '@angular/core';
     
@Component({
    selector: 'countdown',
    templateUrl: 'countdown.html'
})
export class CountdownComponent { 
    days:any = '00';
    hours:any = '00';
    minutes:any = '00';
    seconds:any = '00';
    @Input() startAt:any;
    timeLeft:any;
    
    private timerId:any = null;
    
    ngOnInit() {
        this.start();
    }
    
    start = function () {
        this.timeLeft = this.startAt - Math.ceil(Date.now()/1000);
        if(this.timeLeft>0){
            this.timerId = setTimeout(this.tick.bind(this), 1000);
        }
    };
    
    tick(){
        if(this.timeLeft <= 0){
            clearInterval(this.timerId);
            return false;
        }
        --this.timeLeft;
        
        var days = Math.floor(this.timeLeft / (60 * 60 * 24)) || 0;
        var hours = Math.floor((this.timeLeft - days * (60 * 60 * 24)) / (60 * 60)) || 0;
        var minutes = Math.floor((this.timeLeft - days * (60 * 60 * 24) - hours * (60 * 60)) / 60) || 0;
        var seconds = this.timeLeft - days * (60 * 60 * 24) - hours * (60 * 60) - minutes * 60;
        
        this.days = days > 9 ? days : '0'+days;
        this.hours = hours > 9 ? hours : '0'+hours;
        this.minutes = minutes > 9 ? minutes : '0'+minutes;
        this.seconds = seconds > 9 ? seconds : '0'+seconds;
        
        this.timerId = setTimeout(this.tick.bind(this), 1000);
    }
}