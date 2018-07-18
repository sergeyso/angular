/**
 * Created by t_mit on 1/16/2017.
 */
/**
 * Created by toni on 13.1.17.
 */
export class Folder {
    constructor(
        public name: string = '',
        public id?: number,
        public access?: any,
        public folder_id?: number,
        public sharecomment?: string,
        public Templatefolder?: any,
        public route?: any,
        public search?: any,
        public header_art?: any,
        public syncFilesPublicIds? : Array<any>
    ) {  }
}