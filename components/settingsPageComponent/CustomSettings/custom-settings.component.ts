import {Component} from '@angular/core';

@Component({
    selector: 'custom-settings',
    templateUrl: 'custom-settings.html'
})
export class CustomSettings{
    channelAvatarName: string = '';
    onChangeFile(event) {
        this.channelAvatarName = event.target.files[0].name;
    }
}