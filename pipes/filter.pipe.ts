/**
 * Created by t_mit on 4/10/2017.
 */
import {Pipe, PipeTransform} from '@angular/core';
@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(items: any, filter: any): any {
        if (filter && Array.isArray(items)) {
            return items.filter(item => {
                let regex = new RegExp(filter, 'gi');
                return regex.test(item.contact_user.fullname);
            });
        } else {
            return items;
        }
    }
}