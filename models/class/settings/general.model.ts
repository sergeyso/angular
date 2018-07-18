/**
 * Created by toni on 13.1.17.
 */
export class GeneralSettingsModels {
    constructor(
        public password: string = '',
        public new_password: string = '',
        public new_password_confirm: string = '',
    ) {  }
}