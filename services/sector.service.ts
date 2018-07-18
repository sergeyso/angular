import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {GlobalService} from "./global.service";
import {Observable} from 'rxjs/Observable';
import {Response} from '@angular/http';

@Injectable()
export class SectorService {
    private url = this.globalService.apiUrl;
    startedGuideStatus: boolean = this.globalService.login.data.start_guide && this.globalService.login.data.company_owner;
    startedGuideInfo: string = '0/9';
    showStartedTipsStatus: boolean = false;
    inviteTipShow: boolean = false;
    foldersTipShow: boolean = false;
    createMeetingTipShow: boolean = false;
    connectVaultTipShow: boolean = false;
    securityModalStatus: boolean = false;
    tipsCount: number = 9;
    public sectors: any = [
        {
            name: 'Other',
            channels: ['HR', 'Accounts', 'Office']
        },
        {
            name: 'Accounting',
            channels: ['HR', 'Accounts', 'Office', 'Taxation', 'Costs', 'Invoice', 'Income', 'Reports', 'Software', 'Transactions']
        },
        {
            name: 'Agriculture',
            channels: ['HR', 'Accounts', 'Office', 'Seed', 'Fertiliser', 'Chemicals', 'Production', 'Harvest', 'Regulatory']
        },
        {
            name: 'Architecture',
            channels: ['HR', 'Accounts', 'Office', 'Trends', 'Standards']
        },
        {
            name: 'Arts',
            channels: ['HR', 'Accounts', 'Office', 'Intellectual property']
        },
        {
            name: 'Business Advisors',
            channels: ['HR', 'Accounts', 'Office', 'Marketing', 'Operations', 'R&D', 'Innovation', 'Start-ups']
        },
        {
            name: 'Construction',
            channels: ['HR', 'Accounts', 'Office', 'Contracts', 'Residential', 'Civil', 'Engineering', 'Comercial']
        },
        {
            name: 'Consulting',
            channels: ['HR', 'Accounts', 'Office', 'Strategy', 'Management', 'Operations', 'Finance', 'Technology']
        },
        {
            name: 'Customer Support',
            channels: ['HR', 'Accounts', 'Office', 'FAQ']
        },
        {
            name: 'Design Agency',
            channels: ['HR', 'Accounts', 'Office', 'Product', 'Graphic design', 'Fashion design', 'Materials']
        },
        {
            name: 'Education',
            channels: ['HR', 'Accounts', 'Office', 'Staff Training']
        },
        {
            name: 'Financial Services',
            channels: ['HR', 'Accounts', 'Office', 'Regulations', 'Markets', 'Financial instruments']
        },
        {
            name: 'HR',
            channels: ['HR', 'Accounts', 'Office', 'Culture', 'Communications', 'Disputes', 'Performance Management', 'Training']
        },
        {
            name: 'Insurance',
            channels: ['HR', 'Accounts', 'Office', 'Property', 'Accidents', 'Financial Guarantors', 'Reinsurance', 'Health']
        },
        {
            name: 'Internet',
            channels: ['HR', 'Accounts', 'Office', 'R&D', 'Best Practice', 'QA']
        },
        {
            name: 'IT',
            channels: ['HR', 'Accounts', 'Office', 'Products', 'Software', 'Hardware', 'Platforms', 'Applications']
        },
        {
            name: 'Legal',
            channels: ['HR', 'Accounts', 'Office', 'Partners', 'New Case Law', 'Solicitors', 'Paralegals', 'Human Rights', 'International', 'Dispute Resolution']
        },
        {
            name: 'Market Research',
            channels: ['HR', 'Accounts', 'Office', 'Trends', 'Consumers']
        },
        {
            name: 'Marketing',
            channels: ['HR', 'Accounts', 'Office', 'Advertising', 'Community', 'Customer Service', 'Direct Marketing', 'Research', 'PR']
        },
        {
            name: 'Media Agency',
            channels: ['HR', 'Accounts', 'Office', 'Brand', 'Advertising', 'Public Relations', 'Media', 'Display', 'Digital']
        },
        {
            name: 'Medical Devices',
            channels: ['HR', 'Accounts', 'Office', 'Regulations', 'Tax', 'Marketing', 'Sales', 'Directives']
        },
        {
            name: 'Operations',
            channels: ['HR', 'Accounts', 'Office', 'Onboarding']
        },
        {
            name: 'Pharmaceutical',
            channels: ['HR', 'Accounts', 'Office', 'Raw', 'Materials', 'Packaging', 'R&D', 'Marketing', 'Consumers', 'Licensing']
        },
        {
            name: 'Real Estate',
            channels: ['HR', 'Accounts', 'Office', 'Residential', 'Commercial', 'Lettings', 'Management']
        },
        {
            name: 'Recruitment',
            channels: ['HR', 'Accounts', 'Office', 'Candidates', 'Roles']
        },
        {
            name: 'Retail',
            channels: ['HR', 'Accounts', 'Office', 'Stores', 'Online', 'Research', 'Standards', 'Marketing']
        },
        {
            name: 'Software Development',
            channels: ['HR', 'Accounts', 'Office', 'R&D', 'Best Practice', 'QA']
        },
        {
            name: 'Tourism',
            channels: ['HR', 'Accounts', 'Office', 'Accommodation', 'Food Services', 'Recreation', 'Transportation', 'Entertainment']
        },
        {
            name: 'Transportation',
            channels: ['HR', 'Accounts', 'Office', 'Public Contracts', 'Passenger Manifests', 'International', 'Parts', 'Training', 'Freight', 'Maintenance']
        }
    ];

    constructor(private http: Http,
                private globalService: GlobalService) {
        if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
            this.tipsCount = 10;
        }
        if (this.globalService.login.data.guide_tips) {
            this.startedGuideInfo = JSON.parse(this.globalService.login.data.guide_tips).tips.length + '/' + this.tipsCount;
        }
    }

    public createChannels(index: any) {
        let channels = this.sectors[index].channels;
        let data = {
            Channels: channels.map((channel) => {
                return {
                    name: channel,
                    route: Math.random().toString(36).substr(2, 16)
                }
            })
        };
        let headers = this.globalService.createAuthorizationHeader();
        return this.http.post(this.url + 'channels/multiple', data, {
            headers: headers,
        });
    }

    public closeStartedGuide() {
        let data = {start_guide: false};
        let headers = this.globalService.createAuthorizationHeader();
        return this.http.post(this.url + 'users/self', data, {
            headers: headers,
        });
    }

    public readTips(tips: any, sector: string) {
        let data = {
            guide_tips: JSON.stringify({
                sector: sector,
                tips: tips,
            })
        };
        let headers = this.globalService.createAuthorizationHeader();
        return this.http.post(this.url + 'users/self', data, {
            headers: headers,
        });
    }
}
