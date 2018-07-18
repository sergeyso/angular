/**
 * Created by t_mit on 2/16/2017.
 */
export class Channel {
    constructor(
        public name?: string,
        public id?: number,
        public user_id?: string,
        public user?: Object,
        public col_files?: number,
        public file_avatar?: File,
        public avatardata?: any,
        public is_free?: number,
        public syncCountryIds?: string,
        public countries?: any,
    ) {  }
}