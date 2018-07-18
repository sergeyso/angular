/**
 * Created by t_mit on 6/27/2017.
 */
export class Question {
    constructor(
        public id?: number,
        public title?: string,
        public question?: string,
        public channel_id?: number,
        public channel?: any,
        public attachFiles?:any,
        public syncFilesIds?: Array<any>,
        public addFilesIds?: Array<any>,
        public syncUsersIds?: any,
        public addUsersIds?: Array<any>,
        public syncUserEmails: any = [],
        public privacy_id: number = 1,
    ) {  }
}