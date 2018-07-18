import {Component, EventEmitter, Output, ViewChild, NgZone, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Rx';

import {SendFile} from '../../../models/class/sendFile/SendFile';
import {GlobalService} from '../../../services/global.service';
import {UploadService} from '../../../services/uploadFile.service';
import {FeedService} from '../../../services/feeds.service';
import {FolderService} from '../../../services/folder.service';
import {ResponseApi} from "../../../models/interfaces/responseApi.interface";

const RecordRTC = require('recordrtc/RecordRTC.min');
const ScreenId = require('get-screen-id/dist/getScreenId');


@Component({
    selector: 'app-record-screen',
    templateUrl: 'recordScreen.html'
})
export class RecordScreenComponent {
    @ViewChild('video') video;
    @Output() closePopupEmiter: EventEmitter<any> = new EventEmitter();
    sendFileObject: SendFile = new SendFile(0);
    recordStepVisible: string = 'first';
    loading: boolean = false;
    responseMessage: string = '';
    filename: string = '';
    timer: string = '';
    countDown: number = 3;
    private disabled: boolean = false;
    private subscription: any = null;

    private recordRTC: any = null;
    private curr_video: any;

    private screenStream: MediaStream = null;
    private audioStream: MediaStream = null;

    constructor(
        public globalService: GlobalService,
        public uploadService: UploadService,
        public folderService: FolderService,
        public feedService: FeedService,
        private zone: NgZone,
    ) {
        this.uploadService.progress$.subscribe((data: number) => {});
    }

    /**
     * Hide popup
     */
    hidePopup(): void {
        this.closePopupEmiter.emit({ file: null, isOpen: false});
    }

    enabledDevices(): void {
        navigator.getUserMedia(
            { audio: true },
            () => { },
            (err) => {
                console.log('The following error occurred when trying to use getUserMedia: ' + err);
            }
        );
    }

    disabledDevices(): void {
        if (this.screenStream != null) {
            const screenTracks = this.screenStream.getTracks();
            screenTracks.forEach((track) => {
                track.stop();
            });
            this.screenStream = null;
        }

        if (this.audioStream != null) {
            const audioTracks = this.audioStream.getTracks();
            audioTracks.forEach((track) => {
                track.stop();
            });
            this.audioStream = null;
        }

        if (this.subscription != null) {
            this.subscription.unsubscribe();
        }

        if (this.recordRTC != null) {
            this.recordRTC = null;
        }
    }

    startRecordingClick(): void {
        this.recordStepVisible = 'second';

        this.startRecording();
    }

    /**
     * Start Recording
     */
    startRecording(): void {
        this.timer = '00:00:00';
        this.countDown = 3;
        this.curr_video = null;

        this.captureScreen((screen) => {
            this.captureCamera((camera) => {

                screen.width = window.screen.width;
                screen.height = window.screen.height;
                screen.fullcanvas = true;

                this.recordRTC = RecordRTC([screen, camera], {
                    type: 'video',
                    mimeType: 'video/mp4',
                    getNativeBlob: true,
                    previewStream: (s) => {
                        const video: HTMLVideoElement = this.video.nativeElement;
                        video.muted = true;
                        video.controls = false;
                        video.autoplay = true;
                        video.src = window.URL.createObjectURL(s);
                    }
                });

                this.screenStream = screen;
                this.audioStream = camera;

                this.zone.run(() => {
                    const cd = Observable.timer(0, 1000);
                    const subscription = cd.subscribe(() => {
                        this.countDown--;

                        if (this.countDown <= 0) {
                            subscription.unsubscribe();

                            this.startTimer();

                            this.recordRTC.startRecording();

                            const screenTracks = this.screenStream.getTracks();
                            screenTracks.forEach((track) => {
                                track.onended = () => {
                                    this.stopRecording();
                                };
                            });
                        }
                    });
                });
            });
        });
    }

    /**
     * Stop Recording
     */
    stopRecording(): void {
        if (this.countDown > 0) {
            return;
        }

        this.recordStepVisible = 'third';

        this.filename = 'video_' + this.randomNumber() + '.mp4';

        const recordRTC = this.recordRTC;
        recordRTC.stopRecording(this.processVideo.bind(this));
    }

    /**
     * Save Recording
     */
    saveRecording(): void {
        const file = new File([this.curr_video], this.filename, {
            type: 'video/mp4'
        });

        this.closePopupEmiter.emit({ file: file, isOpen: false});
        // this.sendFileObject.file_content = file;
        // this.sendFileObject.name = this.filename;
        //
        // this.loading = true;
        //
        // if (this.disabled === true) {
        //     return;
        // }
        //
        // this.disabled = true;
        //
        // this.uploadService.upload(this.sendFileObject, `${this.globalService.apiUrl}files`).subscribe(
        //     (uploads: ResponseApi) => {
        //         this.loading = false;
        //         this.disabled = false;
        //         this.feedService.refreshPage = true;
        //         this.folderService.select('root', '', 'root', '');
        //         this.hidePopup();
        //         setTimeout(() => {
        //             this.responseMessage = '';
        //         }, 3000);
        //         if (uploads.response_data.length === 1) {
        //             this.globalService.showSharePopoup(uploads.response_data[0])
        //         }
        //     },
        //     (err: any) => {
        //         this.hidePopup();
        //         this.disabled = false;
        //         this.loading = false;
        //         console.log(err);
        //     });
    }

    startTimer(): void {
        const timer = Observable.timer(0, 1000);
        this.subscription = timer.subscribe((t) => {
            this.timer = this.getTimeFromSeconds(t);
        });
    }

    processVideo(audioVideoWebMURL): void {
        const video: HTMLVideoElement = this.video.nativeElement;
        const recordRTC = this.recordRTC;
        video.src = audioVideoWebMURL;
        this.toggleControls();
        this.curr_video = recordRTC.getBlob();

        this.disabledDevices();
    }

    toggleControls(): void {
        const video: HTMLVideoElement = this.video.nativeElement;
        video.muted = !video.muted;
        video.controls = !video.controls;
        video.autoplay = !video.autoplay;
    }

    captureScreen = (cb): void => {
        ScreenId((error, sourceId, screen_constraints) => {
            const nav = <any>navigator;
            nav.getUserMedia  = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia;

            nav.getUserMedia(screen_constraints, cb, (error: any) => {
                if (error.name === 'InvalidStateError') {
                    if (window.confirm('To record screen on Chrome, you need to install our Chrome Plugin. Do you want to install it?')) {
                        const win = window.open('https://chrome.google.com/webstore/detail' +
                            '/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk', '_blank');
                        if (win) {
                            win.focus();
                        }
                    }
                } else if (error.name === 'NotAllowedError') {
                    alert(error.message);
                }

                this.zone.run(() => {
                    this.recordStepVisible = 'first';
                });
            });
        });
    }

    captureCamera = (cb): void => {
        const nav = <any>navigator;
        nav.getUserMedia  = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia;

        nav.getUserMedia({audio: true}, cb, (error: any) => {});
    }

    randomNumber(): number {
        return Math.random() * (999999999 - 10000000) + 10000000;
    }

    getTimeFromSeconds(seconds): string {
        const date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().substr(11, 8);
    }

    ngOnDestroy() {
        this.disabledDevices();
    }
}
