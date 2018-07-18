/**
 * Created by t_mit on 2/16/2017.
 */
export class User {
    constructor(
        public fullname?: string,
        public username?: string,
        public email?: string,
        public password?: string,
        public file_avatar?: File
    ) {  }
}