/**
 * Created by t_mit on 2/16/2017.
 */
export class ChannelUpdate {
    constructor(
        public id?: number,
        public name?: string,
        public addFilesIds?: string,
        public deleteFilesIds?: string,
        public file_avatar?: File,
        public is_free?: number,
        public syncCountryIds?: any,
        public countries?: any,
        public col_files?: number,
        public user?: Object,
        public user_id?: number,
    ) {  }
}