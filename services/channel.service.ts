/**
 * Created by t_mit on 2/15/2017.
 */
import {Injectable} from '@angular/core';
import {GlobalService} from './global.service';
import {Http, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChannelService {
    private url = this.globalService.apiUrl;
    channelSelected: number;
    channel: any = false;
    channels: Array<any> = [];
    settingsChannels: Array<any> = [];
    filesFromChannel;
    filesIds: Array<any> = [];
    countries: Array<any> = [];
    channelsLoaded: boolean = false;
    constructor(
        public globalService: GlobalService,
        public http: Http
    ) {
        this.alfabeticalSort();
    }

    /**
     * Return All Channels
     * @return {Array}
     */

    alfabeticalSort() {
        this.channels.sort(function(a, b) {
            let textA = a.name.toUpperCase();
            let textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
    }

    setFilesFromChannel() {
        let id;
        if (this.channels.length) {
            id = this.channels[0].id;
            let headers = this.globalService.createAuthorizationHeader();
            this.http.get(this.url + 'channels/' + id + '/filesid', {
                headers: headers,
            }).subscribe((response: Response) => {
                this.filesFromChannel = response.json().response_data;
            })
        }
    }

    setCountries() {
        let headers = this.globalService.createAuthorizationHeader();
        this.http.get(this.url + 'countries/search', {
            headers: headers,
        }).subscribe((response: Response) => {
            this.countries = response.json().response_data;
        })
    }

    setChannels() {
        let headers = this.globalService.createAuthorizationHeader();
        this.http.get(this.url + 'channels/search/self?per-page=0', {
            headers: headers,
        }).subscribe((response: Response) => {
            this.channels = response.json().response_data;
            this.channelsLoaded = true;
        })
    }

    setSettingsChannels() {
        const headers = this.globalService.createAuthorizationHeader();
        this.http.get(this.url + 'channels/search/self-company?per-page=0', {
            headers: headers,
        }).subscribe((response: Response) => {
            this.settingsChannels = response.json().response_data;
        })
    }

    getAllChannel(): Array<any> {
        try {
            return this.channels.concat(
                this.globalService.login.data.channelsSubscribed
            );
        } catch (e) {
            return [];
        }
    }

    removeChannel(id: number) {
        let headers = this.globalService.createAuthorizationHeader();
        return this.http.delete(this.url + 'channels/' + id, {
            headers: headers,
        });
    }
}