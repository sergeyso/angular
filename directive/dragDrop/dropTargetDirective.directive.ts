import { Output, EventEmitter, Input, HostListener, Directive } from '@angular/core';
import {DragService} from "../../services/dragService.service";

export interface DropTargetOptions {
    zone?: string;
    data?: any;
}

@Directive({
    selector: '[myDropTarget]'
})
export class DropTargetDirective {

    constructor(private dragService: DragService) {

    }

    @Input()
    set myDropTarget(options: DropTargetOptions) {
        if (options) {
            this.options = options;
        }
    }

    @Output('myDrop') drop = new EventEmitter();

    private options: DropTargetOptions = {};

    @HostListener('dragover', ['$event'])
    onDragOver(event) {
        event.preventDefault();
        const { zone = 'zone' } = this.options;
        this.dragService.accepts(zone);

        if ( event.target.className == "image-target image-file" ) {
            event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.add('active');
        }

    }

    /* Fire event when dropped area is hovered */
    @HostListener('dragenter', ['$event'])
    onDragEnter(event) {
        if ( event.target.className == "droppable biggerz" ) {
            event.target.classList.add('active');
            //Add active class on second element
            event.target.nextElementSibling.classList.add('active');
        }
    }

    /* Fire event when dropped area is leaved */
    @HostListener('dragleave', ['$event'])
    onDragLeave(event) {
        if ( event.target.className == "droppable biggerz active" ) {
            event.target.classList.remove('active');
            //Remove active class on second element
            event.target.nextElementSibling.classList.remove('active');
        } else if ( event.target.className == "image-target image-file" ) {
            event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.remove('active');
        }
    }

    /* Fire event when file is dropped */
    @HostListener('drop', ['$event'])
    onDrop(event) {
        event.preventDefault();
        let data;
        try {
            data = JSON.parse(event.dataTransfer.getData('Text'));
        } catch (e) {
            data = event.dataTransfer.getData('Text');
        }

        this.drop.next(data);

        //Remove active class when file is dropped from droppable element
        [].slice.call(document.getElementsByClassName('droppable active'))
            .forEach(function(elem) {
                elem.classList.remove('active');
            });

        //Remove active class when file is dropped from list-content-title
        [].slice.call(document.getElementsByClassName('list-content-title active'))
            .forEach(function(elem) {
                elem.classList.remove('active');
        });
    }
}