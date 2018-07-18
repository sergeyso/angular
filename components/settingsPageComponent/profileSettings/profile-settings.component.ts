import {Component, ViewChild} from '@angular/core';
import {GlobalService} from '../../../services/global.service';
import {ProfileSettingsModels} from '../../../models/class/settings/profile.model';
import {NgForm, NgModel} from '@angular/forms';
import {UploadService} from '../../../services/uploadFile.service';
import {GeneralSettingsModels} from '../../../models/class/settings/general.model';
import {ResponseApi} from '../../../models/interfaces/responseApi.interface';
import {ValidationForm} from '../../../helpers/validation';
@Component({
    selector: 'profile-settings',
    templateUrl: 'profile-settings.html'
})
export class ProfileSettings {
    profile: ProfileSettingsModels = new ProfileSettingsModels();
    general: GeneralSettingsModels = new GeneralSettingsModels();
    @ViewChild('updateUser') updateUser: NgForm;
    @ViewChild('picture') picture: any;
    progress: any;
    url: any = '';
    loadIconShow: boolean = false;
    loadIconShowPassword: boolean = false;
    errorMessageInformation: any = '';
    confirmMessageInformation: any = '';
    avatarName: string = 'avatar.png';
    avatar: any;

    constructor(
        public global: GlobalService,
        private uploadService: UploadService,
    ) {
        this.prepeareUserObject();
        this.confirmMessageInformation = '';
        this.errorMessageInformation = '';
        this.uploadService.progress$.subscribe((data: number) => {
            this.progress = data;
        });
    }

    /**
     * Prepear User update object
     */
    prepeareUserObject(): void {
        this.profile.fullname = this.global.login.data.fullname;
        this.profile.email = this.global.login.data.email;
        this.profile.username = this.global.login.data.username;
    }

    /**
     * Update User Information
     */
    updateUserFunction(): void {
        this.loadIconShow = true;
        this.global.postRquest(`${this.global.apiUrl}users/self`, this.profile).subscribe(
            (uploads: ResponseApi) => {
                const token = btoa(this.global.login.credentials[0] + ':' + this.global.login.credentials[1]);
                this.global.login.data = uploads.response_data[0];
                this.global.login.credentials[0] = uploads.response_data[0].email;
                this.global.postRquest(
                    `/update-user/${token}`, {
                    credentials: this.global.login.credentials,
                }).subscribe();
            },
            (error: any) => {
                this.errorMessageInformation = error;
                this.setTimeoutMessage('errorMessageInformation');
                this.loadIconShow = false;
                $('html, body').animate({ scrollTop: 0 }, 'fast');
            },
            () => {
                this.confirmMessageInformation = 'Successfully update user information';
                this.setTimeoutMessage('confirmMessageInformation');
                $('html, body').animate({ scrollTop: 0 }, 'fast');
                this.loadIconShow = false;
            }
        );
    }

    /**
     * Update Password
     */
    onSubmitPassword() {
        try {
            this.loadIconShowPassword = true;
            this.global.postRquest(`${this.global.apiUrl}users/self`, this.general).subscribe(
                (successfully: ResponseApi) => {
                    if (this.general.new_password) {
                        const token = btoa(this.global.login.credentials[0] + ':' + this.global.login.credentials[1]);
                        this.global.login.credentials[1] = this.general.new_password;
                        this.global.postRquest(
                            `/update-user/${token}`, {
                                credentials: this.global.login.credentials,
                            }).subscribe();
                    }
                }, error => {
                    this.errorMessageInformation = error;
                    this.setTimeoutMessage('errorMessageInformation');
                    this.loadIconShowPassword = false;
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                }, () => {
                    this.confirmMessageInformation = 'Successfully update user information';
                    this.setTimeoutMessage('confirmMessageInformation');
                    $('html, body').animate({ scrollTop: 0 }, 'fast');
                    this.loadIconShowPassword = false;
                }
            );
        } catch (e) {
            document.location.href = '/settings';
        }
    }

    private setTimeoutMessage(message) {
        setTimeout(() => {
            this[message] = ''
        }, 5 * 1000);
    }

    onChangeFile(event) {
        this.avatarName = event.target.files[0].name;
    }
}
