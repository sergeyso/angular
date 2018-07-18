import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {GlobalService} from "./global.service";
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PostService {
    public post: any;
    private url = this.globalService.apiUrl;

    constructor(
        private http: Http,
        private globalService: GlobalService
    ) {}

    createFilePost(data: any) {
        const headers = this.globalService.createAuthorizationHeader();
        return this.http.post(this.url + 'files/createmultiple', data, {headers: headers});
    }

    updateFilePost(id: number, data: any) {
        const headers = this.globalService.createAuthorizationHeader();
        return this.http.post(this.url + 'files/' + id, data, {headers: headers});
    }

    updatePost(id: number, data: any) {
        const headers = this.globalService.createAuthorizationHeader();
        return this.http.post(this.url + 'posts/' + id, data, {headers: headers});
    }
}