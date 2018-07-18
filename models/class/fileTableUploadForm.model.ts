/**
 * Created by toni on 13.1.17.
 */
export class FileTable {
    constructor(
        public name: string | null | object = null,
        public description?: any,
        public file_name?: any,
        public file_content?: any,
        public folder_id?: any,
        public folder_name?: any,
        public subfolder_id?: any,
        public subfolder_name?: any,
        public privacy?: any,
    ) {  }
}