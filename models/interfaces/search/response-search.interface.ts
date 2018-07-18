/**
 * Created by t_mit on 1/16/2017.
 */
import {ObjectConstructSearch} from './objectConstructSearch';

export class ResponseSearchInterface {
    constructor(
        public channels: ObjectConstructSearch = new ObjectConstructSearch(),
        public files: ObjectConstructSearch = new ObjectConstructSearch(),
        public folders: ObjectConstructSearch = new ObjectConstructSearch(),
        public peoples: ObjectConstructSearch = new ObjectConstructSearch(),
    ) {  }
}