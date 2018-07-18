import {Component, EventEmitter, Output, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import {GlobalService} from '../../../services/global.service';
import {SendFile} from '../../../models/class/sendFile/SendFile';
import {FolderService} from '../../../services/folder.service';
import {FeedService} from '../../../services/feeds.service';
import {UploadService} from '../../../services/uploadFile.service';
import {Observable} from 'rxjs/Rx';
import {ResponseApi} from '../../../models/interfaces/responseApi.interface';
const RecordRTC = require('recordrtc/RecordRTC.min');

@Component({
    selector: 'app-record-video',
    templateUrl: 'recordVideo.html'
})
export class RecordVideoComponent implements AfterViewInit {
    @ViewChild('video') video;
    @Output() closePopupEmiter: EventEmitter<any> = new EventEmitter();
    recordStepVisible: string = 'first';
    sendFileObject: SendFile = new SendFile(0);
    disabled: boolean = false;
    loading: boolean = false;
    responseMessage: string = '';
    filename: string = '';
    timer: string = '';
    subscription: any = null;

    private stream: MediaStream = null;
    private recordRTC: any;

    curr_video: any;

    constructor(
        public globalService: GlobalService,
        public uploadService: UploadService,
        public folderService: FolderService,
        public feedService: FeedService,
    ) {
        this.uploadService.progress$.subscribe((data: number) => {});
    }

    startRecordingClick(): void {
        this.recordStepVisible = 'second';

        this.startRecording();
    }

    stopRecordingClick(): void {
        this.recordStepVisible = 'third';

        this.stopRecording();
    }

    startNewRecordingClick(): void {
        this.recordStepVisible = 'second';

        const video: HTMLVideoElement = this.video.nativeElement;
        video.muted = false;
        video.controls = true;
        video.autoplay = false;

        this.startRecording();
    }

    /**
     * Hide popup
    */
    hidePopup(): void {
        this.closePopupEmiter.emit({ file: null, isOpen: false});
    }

    ngAfterViewInit() {
        // set the initial state of the video
        const video: HTMLVideoElement = this.video.nativeElement;
        video.muted = false;
        video.controls = true;
        video.autoplay = false;
    }

    enabledDevices(): void {
        navigator.getUserMedia(
            { video: true, audio: true },
            () => { },
            (err) => {
                console.log('The following error occurred when trying to use getUserMedia: ' + err);
            }
        );
    }

    disabledDevices(): void {
        if (this.stream != null) {
            this.stream.stop();
        }

        if (this.subscription != null) {
            this.subscription.unsubscribe();
        }
    }

    /**
     * Start Recording
     */
    startRecording(): void {
        this.timer = '00:00:00';

        const timer = Observable.timer(0, 1000);
        this.subscription = timer.subscribe((t) => {
            this.timer = this.getTimeFromSeconds(t);
        });

        const mediaConstraints = {
            video: true,
            audio: true,
        };
        navigator.mediaDevices
            .getUserMedia(mediaConstraints)
            .then(this.successCallback.bind(this), this.errorCallback.bind(this));
    }

    /**
     * Stop Recording
     */
    stopRecording(): void {
        this.filename = 'video_' + this.randomNumber() + '.mp4';

        const recordRTC = this.recordRTC;
        recordRTC.stopRecording(this.processVideo.bind(this));

        this.disabledDevices();
    }

    /**
     * Save Recording
     */
    saveRecording(): void {
        const file = new File([this.curr_video], this.filename, {
            type: 'video/mp4'
        });

        this.closePopupEmiter.emit({ file: file, isOpen: false});
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

    processVideo(audioVideoWebMURL): void {
        const video: HTMLVideoElement = this.video.nativeElement;
        const recordRTC = this.recordRTC;
        video.src = audioVideoWebMURL;
        this.toggleControls();
        this.curr_video = recordRTC.getBlob();
    }

    toggleControls(): void {
        const video: HTMLVideoElement = this.video.nativeElement;
        video.muted = !video.muted;
        video.controls = !video.controls;
        video.autoplay = !video.autoplay;
    }

    successCallback(stream: MediaStream): void {
        const options = {
            mimeType: 'video/mp4', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
            audioBitsPerSecond: 512000,
            videoBitsPerSecond: 512000,
            bitsPerSecond: 512000 // if this line is provided, skip above two
        };
        this.stream = stream;
        this.recordRTC = RecordRTC(stream, options);
        this.recordRTC.startRecording();
        const video: HTMLVideoElement = this.video.nativeElement;
        video.src = window.URL.createObjectURL(stream);
        this.toggleControls();
    }

    errorCallback(err): void {
        console.log(err);
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
