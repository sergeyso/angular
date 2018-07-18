import {Component} from '@angular/core';
import {GlobalService} from '../../../services/global.service';
import {FolderService} from '../../../services/folder.service';
import {Response} from '@angular/http'

@Component({
    selector: 'main-header',
    templateUrl: 'main-header.html',
    host: {
        '(document:click)': 'onClick($event)',
    },
})
export class MainHeaderComponent {
    userDropdownVisible: boolean = false;
    mobileNavigationVisible: boolean = false;
    companyDropdown: boolean = false;
    helpUrl: string = window['help'];
    username: string = '';
    email: string = '';
    logo: any = [];
    constructor(
        public global: GlobalService,
        public folderService: FolderService,
    ) {
        this.getCompanies();
    }

    showUserDropdown() {
        this.userDropdownVisible = !this.userDropdownVisible;
    };

    onClick(event: any) {
        if (!$(event.target).hasClass('close-user-dropdown-header')) {
            this.userDropdownVisible = false;
        }
    }

    goToRoot() {
        document.location.href = '/';
    }

    // Open mobile header
    openMobileNavigation() {
        this.mobileNavigationVisible = !this.mobileNavigationVisible;
    }

    // Open company dropdown
    openCompanyDropdown() {
        this.companyDropdown = !this.companyDropdown;
        this.global.headerBigerZindex = !this.global.headerBigerZindex;
    }

    getCompanies() {
        this.global.setCompanies()
            .subscribe((response: Response) => {
                this.global.companies = response.json().response_data;
                this.checkCompanyOrUser();
            });
        // this.global.companies = JSON.parse(document.getElementById('mainDiv').getAttribute('getOrganisations'));
        // document.getElementById('mainDiv').removeAttribute('getOrganisations');
    }

    checkCompanyOrUser() {
        if (this.global.login.data.company_id) {
            const company = this.global.companies.find(value => {
                return value.id === this.global.login.data.company_id;
            });
            this.username = company.name;
            this.email = this.global.login.data.email;
            this.logo = company;
            this.logo['type'] = 'company';
        } else {
            this.username = this.global.login.data.fullname;
            this.email = this.global.login.data.email;
            this.logo = this.global.login.data;
            this.logo['type'] = 'user';
        }
    }
}