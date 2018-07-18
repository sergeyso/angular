import {LicenceFileOption} from "./option.model";
/**
 * Created by t_mit on 2/8/2017.
 */
export class LicenceFile {
    constructor(
        public token:string =  "",
        public video_id:any =  "",
        public options?:Array<LicenceFileOption>,
    ) {  }
}