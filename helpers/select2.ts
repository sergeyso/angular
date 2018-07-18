import {GlobalService} from '../services/global.service';
/**
 * Created by t_mit on 2/27/2017.
 */
declare var $: any;

export abstract class Select2 {
    accessVar: any;
    fileAccess: any = [];
    newUser: boolean = false;

    constructor(public globalService: GlobalService) {}
    /*Access*/
    accessSelect(keys: Array<string>) {
        this.accessVar = $('.shareaccess').select2({
            multiple: true,
            tags: true,
            tokenSeparators: [',', ' '],
            ajax: {
                url: this.globalService.apiUrl + 'users/search',
                headers: {
                    'Authorization': 'Basic ' + btoa(this.globalService.login.credentials[0] + ':' + this.globalService.login.credentials[1]),
                },
                delay: 500,
                data: function(params: any){
                    return {
                        query: params.term,
                    };
                },
                processResults: function(data: any, params: any){
                    const object = filtrationArray(data.response_data, keys);

                    return {
                        results:
                            object.map(function(item) {
                                return {
                                    id: item.id,
                                    text: item.email
                                };
                            })
                    };
                },
                cache: true
            },
            minimumInputLength: 3,
            containerCssClass: 'white-orange',
            dropdownCssClass: 'white-orange biggerz',
            createTag: function(term, data) {
                const value = term.term;
                if (validateEmail(value)) {
                    return {
                        id: value,
                        text: value
                    };
                }
                return null;
            },
            language: {
                'noResults': function(){
                    return 'Please select user or add email address';
                }
            },
        });

        function filtrationArray(data, keys) {
            return data.filter(e => {
                return keys.indexOf(e.id.toString()) < 0
            });
        }

        function validateEmail(email) {
            const re = /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    }

    /**
     * Select2 Access change
     */
    accessSelectChange() {
        this.accessVar.on('change', (e: any) => {
            this.fileAccess = $(e.target).val();
        });
    }

    /**
     * Return Object for share files
     * @returns {Object}
     */
    accessStructure(access = null) {
        let objectInteger:Object = {};
        let arrayNewContact:Array<any> = [];
        if(this.fileAccess.length) {
            this.fileAccess.forEach((a: any, e) => {
                if(Number.isInteger(parseInt(a))) {
                    objectInteger[a] = this.manageAccess(access);
                } else {
                    this.newUser = true;
                    arrayNewContact.push(
                        {
                            email:a,
                        }
                    )
                }
            });
        }

        return {
            accessUser: objectInteger,
            newUser: arrayNewContact
        };
    }

    private manageAccess(access) {
        let array = ['read'];
        if(access) {
            if(Array.isArray(access)) {
                array = array.concat(access);
            } else {
                array.push(access);
            }
        }
        return array
    }

    /**
     * @param id
     * @param newUsers
     * @param access
     */
    invitedNewContact(id, newUsers, access = null) {
        const object = {
            Invitecontact : newUsers, // newuser is array of emails
            shareAccess: JSON.stringify(this.manageAccess(access)), // string
            shareId: id // id of shared id
        };
        this.globalService.postRquest(this.globalService.apiUrl+'invites/addbyemails', object).subscribe();
    }
}