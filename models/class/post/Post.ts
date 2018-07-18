/**
 * Created by t_mit on 4/21/2017.
 */
export class Post {
    constructor(
        public channel_id: number | null,
        public id?: number,
        public text?: string,
        public color?: string,
        public access?: string,
        public privacy_id: any = 1,
        public emails?: any
    ) {}
}