import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {GlobalService} from "./global.service";
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SettingsService {
    private url = this.globalService.apiUrl;
    currentPackage: any = {};

    constructor(private globalService: GlobalService,
                private http: Http) {
        this.getCompanyInvites();
        this.getCurrentPackage();
    }

    buySeats(data: any) {
        const headers = this.globalService.createAuthorizationHeader();
        return this.http.post(this.url + 'users/add-seats', data, {headers: headers});
    }

    getCompanyInvites() {
        const headers = this.globalService.createAuthorizationHeader();
        return this.http.get(this.url + 'invites/company-list', {headers: headers});
    }

    getCurrentPackage() {
        const headers = this.globalService.createAuthorizationHeader();
        this.http.get(this.url + 'users/current-package', {headers: headers})
            .subscribe((response: Response) => {
                this.currentPackage = response.json().response_data;
            });
    }
}
