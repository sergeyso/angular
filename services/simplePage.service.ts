/**
 * Created by t_mit on 4/18/2017.
 */
import {Injectable, NgZone}    from '@angular/core';
import {GlobalService} from "./global.service";
import {ChannelService} from "./channel.service";

@Injectable()
export class SimplePageService {

    constructor(
        public globalService: GlobalService,
        public channelService: ChannelService,
        public lc: NgZone
    ) {}

    folders: Array<any> = [];
    foldersCache: Array<any> = [];
    channels: Array<any> = [];
    channelsCache: Array<any> = [];
    selected:boolean = false;
    loadMore: boolean = false;
    speed: number = 2000;
    page: number = 0;

    request: string = 'folders';
    sliderCall: Array<number> = [];
    perPageFiles: number = 14;
    allFiles:Array<any> = [];
    loading:boolean = false;
    typeRequest:string = '';
    simplePageOpacity:boolean = false;
    selectedFolderId: number | null;
    selectedFolderIndex: number | null;
    selectedFolderIdDouble: number | null = null;
    folderTypeSelected: string = '';

    private addFlexSlider(array: Array<any>) {
        for (let i = 0; i < array.length; i++) {
            this.speed = this.speed + 1000;
            this.flexslider(array[i]);
        }
    }

    private flexslider(object) {
        let slider = $('#'+object.id);
        slider.flexslider({
            animation: "slide",
            slideshow: false,
            animationLoop: false,
            itemWidth: 220,
            itemMargin: 3,
            controlNav: false,
            after: (slider: any) => {
                let curSlide = slider.currentSlide+1;
                let currentPage = Math.trunc(slider.count / this.perPageFiles);
                if(curSlide >= slider.pagingCount && this.sliderCall.indexOf(object.id) < 0 && currentPage > 0) {
                    this[`getFiles${this.typeRequest}`](object, currentPage+1).then(
                        (isSuccess: Response) => {
                            this.loopImageSliders(isSuccess.response_data, object);
                            if(isSuccess.response_data.length < this.perPageFiles) {
                                this.sliderCall.push(object.id);
                            }

                        }, error => {
                            console.error(error);
                        }
                    );
                }
            },
            start: (slider: any) => {
                if(this.request == 'folders') {
                    slider.find("img").attr("draggable", "true");
                }
            }
        });
        slider.css('opacity', '1');
    }

    private loopImageSliders(data: Array<any>, object) {
        data.forEach(image => {
            this.addImage(image, object);
        });
    }

    addImage(image, object) {
        let imageShow = this.getImage(image);
        let boolean:boolean = this.request == 'folders';
        let div = `<li>
                       <div class="single-file">
                         <div class="inner">
                            <div id="${image.id}" class="image-container folder-container ${image.file_type}">
                                <img draggable="${boolean}" class="image-target image-file" src="${imageShow}" version="2" />
                            </div>
                         </div>
                      </div>
                   </li>`;

        $('#'+object.id).data('flexslider').addSlide($(div));
    }

    private getImage(image) {
        try {
            let value = this.globalService.getValueFormImageFeed(image);
            return value.encodings[2].uri;
        } catch (e) {
            return '/images/default.png';
        }
    }

    getFolders(loop = false) {
        if(!this.loading || loop == true) {
            this.loading = true;
            this.loadMoreRun(true);
            this.page = this.page + 1;
            this.globalService.getRquest(this.globalService.apiUrl+'folders/flat', {
                'per-page': '5',
                'page': this.page
            }).subscribe(
                (successfully: Response) => {
                    this.typeRequest = 'Folder';
                    this.contatArray(successfully.response_data, this.typeRequest).then(
                        sucessfullyFiltered => {
                            this.addFlexSlider(this.folders);
                            if(this.folders.length < 5) {
                                return this.getFolders(true);
                            }
                            this.loadMoreRun(false);
                            this.loading = false;
                        }, error => {
                            this.nextStep('channels');
                        }
                    );
                    if(!successfully.response_data.length) {
                        this.nextStep('channels');
                    }
                }, error => {
                    this.nextStep('channels');
                }
            )
        }
    }

    private nextStep(type) {
        this.loading = false;
        this.request = type;
        this.page = 0;
        this.loadMoreRun(false);
    }

    private loadMoreRun(boolean: boolean) {
        this.lc.run(() => {
            this.loadMore = boolean;
        });
    }

    contatArray(successfully, type) {
        return new Promise((resolve, reject) => {
            this.checkHasFile(successfully, type).then(
                (successfully:any) => {
                    this.lc.run(() => {
                        this[`${type.toLowerCase()}s`].push(...successfully);
                    });
                    setTimeout(() => {
                        resolve();
                    }, 500);
                }, error => {
                    reject();
                }
            );
        });
    }

    checkHasFile(array, type) {
        let count = 0;
        return new Promise((resolve, reject) => {
            if(array.length) {
                array.forEach((value:any, index:number) => {
                    this[`getFiles${type}`](value).then(
                        (isSuccess: Response) => {
                            value.files = isSuccess.response_data;
                            count = count + 1;
                            countLoop(count, array);
                        }, error => {
                            count = count + 1;
                            countLoop(count, array);
                        }
                    )
                });
            } else {
                reject();
            }


            function countLoop(count, folders) {
                if(count == folders.length ) {
                    let foldersFiltered = folders.filter((value:any, index:number) => {
                        if("files" in value) {
                            return true;
                        }
                    });
                    if(foldersFiltered.length) {
                        resolve(foldersFiltered)
                    } else {
                        reject();
                    }
                }
            }
        });
    }

    getFilesFolder(value, page = 1) {
        return new Promise((resolve, reject) => {
            this.globalService.getRquest(this.globalService.apiUrl+'files/search', {
                'per-page': this.perPageFiles,
                'filter[folderhashid][]': value.hash_id,
                'page': page
            }).subscribe(
                (successfully: Response) => {
                    this.allFiles.push(...successfully.response_data);
                    resolve(successfully)
                }, error => {
                    reject(error)
                }
            );
        });
    }

    onScroll() {
        window.onscroll = () => {
            let windowHeight = "innerHeight" in window ? window.innerHeight
                : document.documentElement.offsetHeight;
            let body = document.body, html = document.documentElement;
            let docHeight = Math.max(body.scrollHeight,
                body.offsetHeight, html.clientHeight,
                html.scrollHeight, html.offsetHeight);
            let windowBottom = windowHeight + window.pageYOffset;
            if (windowBottom >= docHeight && !this.selected && !this.loadMore) {
                switch (this.request) {
                    case'folders':
                        this.getFolders();
                        break;
                    case'channels':
                        this.getchannels();
                        break;
                    /*case'contacts':
                        this.loadMoreRun(false);
                        this.loading = false;
                        break;*/
                }
            }
        };
    }

    getchannels() {
        this.loadMoreRun(true);
        this.typeRequest = 'Channel';
        this.contatArray(this.channelService.channels, 'Channel').then(
            sucessfullyFiltered => {
                this.addFlexSlider(this.channels);
                this.loadMoreRun(false);
                this.loading = false;
                this.nextStep('contacts');
            }, error => {
                this.nextStep('contacts');
            }
        );
    }

    getFilesChannel(value, page = 1) {
        return new Promise((resolve, reject) => {
            this.globalService.getRquest(this.globalService.apiUrl+`channels/${value.id}/files`, {
                'per-page': this.perPageFiles,
                'page': page
            }).subscribe(
                (successfully: Response) => {
                    this.allFiles.push(...successfully.response_data);
                    resolve(successfully)
                }, error => {
                    reject(error)
                }
            );
        });
    }

    findFile(data) {
        return this.allFiles.find(allFiles => {
            let value = this.globalService.getValueFormImageFeed(allFiles);
            if(Object.keys(value).length) {
                return value.encodings[2].uri == data
            }
        });
    }

    onDrop(data: any, folder) {
        let file = this.findFile(data);
        /*        let oldFolder = file.folder_id;
         let newFolder = folder.id;*/
        if(file.folder_id != folder.id && !this.loading) {
            this.loading = true;
            this.loadMoreRun(true);
            this.simplePageOpacity = true;
            this.globalService.postRquest(`${this.globalService.apiUrl}files/${file.id}`, {
                folder_id: folder.id
            }).subscribe(
                (successfully: any) => {
                    this.reloadPage();
                },
                (error: any) => {
                    this.loading = false;
                    this.loadMoreRun(false);
                    this.simplePageOpacity = false;
                }
            );
        }
    }

    private clearAll() {
        this.page = 0;
        this.folders = [];
        this.request = 'folders';
        this.sliderCall = [];
        this.allFiles = [];
        this.channels = [];
        this.typeRequest = '';
        $('html, body').animate({ scrollTop: 0 }, 'fast');
        this.simplePageOpacity = false;
        this.selected = false;
    }

    reloadPage() {
        this.clearAll();
        this.getFolders(true);
    }

    showObject(index, id, type, object) {
        switch (type) {
            case'folder':
                if (this.selectedFolderIndex == null || this.selectedFolderIndex != index || this.folderTypeSelected != 'folder') {
                    this.folderTypeSelected = type;
                    this.selectedFolderId = id;
                    this.selectedFolderIndex = index;
                    this.showObjectDatabase('Folder', object);
                }
                else {
                    this.selectedFolderIndex = null;
                }
                break;
            case'subfolder':
                this.showObjectDatabase('Folder', object);
                break;
            case'channel':
                this.selectedFolderIndex = null;
                this.showObjectDatabase('Channel', object);
                break;
        }
    }

    private showObjectDatabase(type, object) {
        this.clearAll();
        this.selected = true;
        this.loading = true;
        this.loadMoreRun(true);
        this.typeRequest = type;
        this.contatArray([object], this.typeRequest).then(
            sucessfullyFiltered => {
                this.addFlexSlider(this[`${this.typeRequest.toLowerCase()}s`]);
                this.loadMoreRun(false);
                this.loading = false;
            }, error => {
                this.loadMoreRun(false);
                this.loading = false;
                alert(`Empty file in this ${this.typeRequest}`);
            }
        );
    }
}