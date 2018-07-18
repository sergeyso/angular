/**
 * Created by t_mit on 1/30/2017.
 */
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from "rxjs";
import {GlobalService} from "./global.service";

@Injectable()
export class UsersService {

    constructor(private http: Http,
                private globalService: GlobalService) {
    }

    public setInvitedUsers() {
        let headers = this.globalService.createAuthorizationHeader();
        return this.http.get(this.globalService.apiUrl + "invites/list",
            {
                headers: headers
            })
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getUsersId(search: Array<any>): Observable<any> {
        let params = this.convertParams(search);
        let headers = this.globalService.createAuthorizationHeader();
        return this.http.get(this.globalService.apiUrl + "users/search?" + params,
            {
                headers: headers
            })
            .map(this.extractData)
            .catch(this.handleError);
    }

    public addNewContact(email): Observable<any> {
        let headers = this.globalService.createAuthorizationHeader();
        return this.http.post(this.globalService.apiUrl + "invites/addbyemails",
            {
                email: email
            }, {
                headers: headers
            })
            .map(this.extractData)
            .catch(this.handleError);
    }

    public resendInvitation(id: number): Observable<any> {
        let headers = this.globalService.createAuthorizationHeader();
        return this.http.get(this.globalService.apiUrl + 'invites/resend/' + id,
            {headers: headers})
            .map(this.extractData)
            .catch(this.handleError);
    }

    public withdrawInvitation(id: number): Observable<any> {
        let headers = this.globalService.createAuthorizationHeader();
        return this.http.delete(this.globalService.apiUrl + 'invites/' + id,
            {headers: headers})
            .map(this.extractData)
            .catch(this.handleError);
    }

    private convertParams(search) {
        let object = '';
        search.forEach(e => {
            let id = 'ids[]=' + e;
            if (object == '') {
                object = id;
            } else {
                object = object + '&' + id;
            }
        });
        return object;
    }

    private extractData(res: Response) {
        return res.json() || {};
    }

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}