/**
 * Created by toni on 20.3.17.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class FacebookService {
    facebook: boolean = false;
    shortAccessToken: string = '';
    showButton: boolean = false;
    constructor() {}

    connectSdkFacebook() {
        FB.init({
            appId: window['facebookapp'],
            status: true,
            cookie: true,
            xfbml: true
        });

        FB.getLoginStatus((response) => {
            this.facebook = response.status === 'connected';
            if(this.facebook) {
                this.shortAccessToken = response.authResponse.accessToken;
            }
            this.showButton = true;
        });
    }

    login() {
        FB.login((response) => {
            this.facebook = true;
        }, {scope: 'email,user_likes,publish_actions'});
    }

    logout() {
        FB.logout((response) => {
            this.facebook = false;
        });
    }

    /*longLivedToken() {

    }

    sendDialog() {
        // Note: The call will only work if you accept the permission request
        FB.api('/me/feed', 'post', {
            link: 'http://www.example.com',
            access_token: 'EAADnkWzNaYsBADEXUaBPdfSZB3XqTUVYuxXCdZAAuZCCecoBk5EfRIJChkgUcRZCq6C1YyOUgxTGL8AxNhCfzA2ZAZBhhMhXrhpuMJKMaj25g5pjCXiEsKoZCFvUDegTiryLr6tCnmbU8arg9g4x0EtJfzsW8BcyW4ZD',
            message: 'Hello, world!'
        });
    }*/
}