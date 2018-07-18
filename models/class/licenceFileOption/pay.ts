/**
 * Created by t_mit on 4/26/2017.
 */
export class Pay {
    constructor(
        public id: number,
        public amount: number,
        public card_number: string = '',
        public expiry_month: string = '',
        public expiry_year: string = '',
        public cvc: string = '',
        public currency: string = 'EUR',
    ) {  }
}