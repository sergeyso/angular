/**
 * Created by t_mit on 5/4/2017.
 */
export class SendFile {
    constructor(
        public sendto_user_id: number,
        public file_content: any = '',
        public message: string = '',
        public name?,
    ) {}
}