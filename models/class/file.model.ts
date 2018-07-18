/**
 * Created by toni on 13.1.17.
 */
export class File {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public channel_id?: number,
        public folder_id?: any,
        public subfolder_id?: any,
        public access?: any,
        public file_content?: File,
        public addTags?: any,
        public sharecomment?: any,
        public privacy_id?: any,
    ) {  }
}