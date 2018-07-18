/**
 * Created by toni on 13.1.17.
 */
export class ProfileSettingsModels {

    _token:any = document.querySelector('meta[name="csrf-token"]')['content'];

    constructor(
        public fullname: string = '',
        public email: string = '',
        public username: string = '',
        public bio: string = '',
        public file_avatar?: File,
    ) {  }
}