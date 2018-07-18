/**
 * Created by toni on 23.8.16.
 */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {GlobalService} from "./global.service";
import {Http, Response} from "@angular/http";

@Injectable()
export class UploadService {

    progress: any;
    progress$: any;
    progressObserver: any;
    counterArray:number = 0;
    cancelUpload: boolean = false;
    public xhr: XMLHttpRequest;
    auth:any = '';

    constructor (
        private globalService: GlobalService,
        private http: Http,
    ) {
        this.progress$ = Observable.create(observer => {
            this.progressObserver = observer
        }).share();
    }

    public upload (model: any, url:string): Observable<any> {
        this.xhr = new XMLHttpRequest();
        return Observable.create(observer => {
            let formData: FormData = new FormData();

            for (let i in model) {
                if(model[i]) {
                    formData.append(i, model[i]);
                }
            }

            this.xhr.onreadystatechange = () => {
                if (this.xhr.readyState === 4) {
                    if (this.xhr.status === 200) {
                        observer.next(JSON.parse(this.xhr.response));
                        observer.complete();
                    } else {
                        observer.error(this.xhr.response);
                    }
                }
            };

            UploadService.setUploadUpdateInterval(0);
            this.xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);
                this.progressObserver.next(this.progress);
            };

            this.xhr.open('POST', url, true);
            this.xhr.setRequestHeader("Authorization", "Basic " + this.checkAuth());
            this.xhr.setRequestHeader("Accept", "application/json");
            this.xhr.send(formData);
        });
    }

    public updateFile(model) {
        let headers = this.globalService.createAuthorizationHeader();
        return this.http.post(this.globalService.apiUrl+'files/'+model.id, model,{
            headers: headers
        })
            .map(this.extractData)
            .catch(this.handleError);
    }

    private checkAuth() {
        if(this.auth == '') {
            return btoa(this.globalService.login.credentials[0]+":"+this.globalService.login.credentials[1])
        }

        return this.auth
    }

    /**
     * Cancel Post
     */
    public cancel(): void {
        this.xhr.abort();
        UploadService.setUploadUpdateInterval(0);
        this.progressObserver.next(0);
    }

    /**
     * Set interval for frequency with which Observable inside Promise will share data with subscribers.
     *
     * @param interval
     */
    private static setUploadUpdateInterval (interval: number): void {
        setInterval(() => {}, interval);
    }

    private extractData(res: Response) {
        return res.json() || { };
    }
    private handleError (error: Response | any) {
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
