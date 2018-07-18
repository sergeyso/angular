/**
 * Created by t_mit on 4/21/2017.
 */
export class SubscribeFiles {
    constructor(
        public open: boolean = false,
        public submit: boolean = false,
        public files: Array<any> = [],
    ) {}
}