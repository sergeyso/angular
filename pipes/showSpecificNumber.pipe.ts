/**
 * Created by t_mit on 4/10/2017.
 */
import {Pipe, PipeTransform} from '@angular/core';
@Pipe({
    name: 'specificNumber'
})
export class SpecificNumberPipe implements PipeTransform {

    /**
     * Transform Array length
     * @param items
     * @param number
     * @return {any}
     */
    transform(items: Array<any>, number: number): Array<any> {
        if (number && Array.isArray(items) && items.length >= number) {
            return items.slice(0, number)
        } else {
            return items;
        }
    }
}