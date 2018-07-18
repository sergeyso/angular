import {Component} from '@angular/core';
import {IMyDateModel, IMyDpOptions} from "mydatepicker";
@Component({
    selector: 'settings-transactions',
    templateUrl: 'settings-transactions.html'
})
export class TransactionsSettings  {
    choosenDate: string = 'Now';

    myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'dd.mm.yyyy',
        showClearDateBtn: false
    };

    onDateChanged(event: IMyDateModel) {
        this.choosenDate = event.formatted;
    };
}