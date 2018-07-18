import { Component, Input, Output, EventEmitter, AfterViewInit, ElementRef, ViewEncapsulation } from '@angular/core';
import * as $ from 'jquery';
import "flatpickr";

@Component({
    selector: 'datetimepicker',
    templateUrl: 'datetimepicker.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        'flatpickr.min.css',
        'confirmDate.css',
        'datetimepicker.css',
    ]
})
export class DateTimePickerComponent{ 
    @Input() options:object;
    
    @Output() onBeforeInit = new EventEmitter();
    @Output() onAfterInit = new EventEmitter();
    @Output() onChanged = new EventEmitter();

    $picker: any;

    ngAfterViewInit() {
        var confirms = [
            {
                className: 'cancel',
                confirmText: 'Cancel',
                onClick: (instance, element, event) => {
                    instance.close();
                }
            },
            {
                className: 'schedule',
                confirmText: 'Schedule',
                onClick: (instance, element, event) => {
                    if(instance.selectedDates.length){
                        instance.close();
                        this.onChanged.next(instance);
                    }
                }
            }
        ];
        
        var config = Object.assign({
            enableTime: true,
            wrap: true,
            defaultDate: (new Date()),
            time_24hr: true,
            onReady: (selectedDates, dateStr, instance) => {
				if (instance.calendarContainer === undefined) return;
                instance.confirmContainer = instance._createElement("div", "flatpickr-confirm visible lightTheme", '');
                instance.calendarContainer.appendChild(instance.confirmContainer);
                for(var i=0;i<confirms.length;i++) {
                    var conf = confirms[i];
                    var confirmItem = instance._createElement("div", "flatpickr-confirm-item " + conf.className, conf.confirmText);
                    confirmItem.tabIndex = -1;
                    confirmItem.addEventListener("click", confirms[i].onClick.bind(confirms[i], instance, confirmItem));
                    instance.confirmContainer.appendChild(confirmItem);
                }
			}
        }, this.options);
        
        this.onBeforeInit.next(config);
        this.$picker = ($(this.el.nativeElement).find('.flatpickr') as any).flatpickr(config);
        this.$picker.showTimeInput = true;
        this.onAfterInit.next(this.$picker)
    }
    
    constructor(private el: ElementRef) {
        
    }
}