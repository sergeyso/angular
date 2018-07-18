import {Component, AfterViewInit, OnInit} from '@angular/core';
import {GlobalService} from "../../../services/global.service";
import {Select2} from "../../../helpers/select2";
import {SharedService} from "../../../services/shared.service";
import {Folder} from "../../../models/class/folder.model";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare let $: any;

@Component({
    selector: 'right-folder-column',
    templateUrl: 'right-folder-column.html'
})
export class RightColumnFolder extends Select2 implements AfterViewInit, OnInit {
    chooseTemplateVar:any;
    templateFontVar:any;
    vimeoCategoryVar:any;
    youTubeCategoryVar:any;
    dailymotionCategoryVar:any;
    color: string = "#127bdc";
    view_type: string = "list";
    font: string = "Montserrat Regular";
    moreOptionVar:boolean = false;
    socialShareCategoryOpen:string = '';
    folder: Folder = new Folder(
        this.globalService.folderObject.folder.name,
        this.globalService.folderObject.folder.id,
        this.globalService.folderObject.folder.access,
        this.globalService.folderObject.folder.folder_id
    );
    templateOption: any;
    templates:Array<string> = [
        'list',
        'grid'
    ];
    fonts:Array<string> = [
        "Montserrat Regular",
        "Roboto Regular",
        "Lato Regular",
        "Fira Regular",
        "Open Sans Regular",
        "Source Sans Regular",
    ];

    constructor(
        public globalService: GlobalService,
        public sharedService: SharedService,
        private formbuilder: FormBuilder
    ) {
        super(globalService);
        this.sharedService.loadSharedUser = true;
        sharedService.checkSharedWith(this.globalService.folderObject.folder, 'folders/info');
        sharedService.checkSharedPublic(this.globalService.folderObject.folder, 'contribute');
        this.prepereTemplate();
    }

    private prepereTemplate() {
        if(this.globalService.folderObject.folder.template) {
            this.color = this.globalService.folderObject.folder.template.color;
            this.view_type = this.globalService.folderObject.folder.template.view_type;
            this.font = this.globalService.folderObject.folder.template.font;
        }
    }

    ngOnInit() {
        this.templateOption = this.formbuilder.group({
            view_type: [this.view_type],
            font: [this.font],
            sharecomment: ['']
        });
        this.templateOption.controls['view_type'].valueChanges.subscribe((value) => {
            console.log(value);
        });
    }

    ngAfterViewInit() {
        this.accessSelect(Object.keys(this.globalService.folderObject.folder.access.users));
        this.accessSelectChange();
        this.chooseTemplate();
        this.templateFont();
        this.vimeoCategory();
        this.youTubeCategory();
        this.dailymotionCategory();
        this.sharedService.isShared();
    }

    addNewUserFunc() {
        try {
            let value = {
                color: this.color,
                view_type: this.view_type,
                font: this.font,
            };
            this.folder.sharecomment = this.templateOption.controls['sharecomment'].value;
            this.folder.Templatefolder = value;
            this.updateShareAccess();
        } catch (e) {
            console.error(e);
        }
    }

    private updateShareAccess() {
        let object = this.accessStructure(['write', 'contribute']);
        if(this.newUser) {
            this.invitedNewContact(this.globalService.folderObject.folder.id, object.newUser, ['write', 'contribute']);
        }

        if(Object.keys(object.accessUser).length != 0) {
            this.globalService.folderObject.folder.access.users = Object.assign(object.accessUser, this.globalService.folderObject.folder.access.users);
        }
        this.sharedService.loadMakePublic = true;
        this.folder.access = JSON.stringify(this.globalService.folderObject.folder.access);
        this.sharedService.callserver(this.folder, 'folder').then(success => {
            this.templateOption.controls['sharecomment'].setValue('');
            this.sharedService.makeRequestGetObject('folders/info');
        }, error => {
            console.error(error);
            this.sharedService.loadMakePublic = false;
        });
        $('.shareaccess').val([]).trigger("change");
    }

    deleteUser(user) {
        try {
            if(user.status == 'active') {
                return this.deleteActiveUser(user);
            }
            return this.deleteInvitedUser(user);
        } catch(e) {
            console.error(e);
        }
    }

    protected deleteActiveUser(user) {
        this.sharedService.loadMakePublic = true;
        this.globalService.folderObject.folder.access.users[user.id] = [];
        this.folder.access = JSON.stringify(this.globalService.folderObject.folder.access);
        this.sharedService.callserver(this.folder, 'folder').then(success => {
            if(this.sharedService.sharedWith.length == 1) {
                this.sharedService.sharedWith = [];
            }
            this.sharedService.makeRequestGetObject('folders/info');
        });
    }

    protected deleteInvitedUser(user) {
        this.sharedService.loadMakePublic = true;
        this.globalService.deleteRquest(`${this.globalService.apiUrl}invites/${user.id}`).subscribe(success => {
            if(this.sharedService.sharedWith.length == 1) {
                this.sharedService.sharedWith = [];
            }
            this.sharedService.makeRequestGetObject('folders/info');
        });
    }

    //Choose template select
    private chooseTemplate() {
        this.chooseTemplateVar = $('.choose_template').select2({
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange",
            minimumResultsForSearch: Infinity
        });

        this.chooseTemplateVar.on('change', (e: any) => {
            this.view_type = $(e.target).val();
        });
    }

    //Template font
    private templateFont() {
        this.templateFontVar = $('.template_font').select2({
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange",
            minimumResultsForSearch: Infinity
        });

        this.templateFontVar.on('change', (e: any) => {
            this.font = $(e.target).val();
        });
    }

   // YouTube category
    private youTubeCategory() {
        this.youTubeCategoryVar = $('.you_tube_category').select2({
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange",
            placeholder: "Select YouTube category",
            minimumResultsForSearch: Infinity
        });
    }


    //Vimeo category
    private vimeoCategory() {
        this.vimeoCategoryVar = $('.vimeo_category').select2({
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange",
            minimumResultsForSearch: Infinity,
            placeholder: 'Select Vimeo category'
        });
    }
    //Dailymotion category
    private dailymotionCategory() {
        this.dailymotionCategoryVar = $('.dailymotion_category').select2({
            containerCssClass: "white-orange",
            dropdownCssClass: "white-orange",
            minimumResultsForSearch: Infinity,
            placeholder: 'Select Dailymotion category'
        });
    }

    //Open more option container
    openMoreOption() {
        this.moreOptionVar = !this.moreOptionVar;
    }

    openSocialCategory(variable) {
        this.socialShareCategoryOpen = variable;
    }
}