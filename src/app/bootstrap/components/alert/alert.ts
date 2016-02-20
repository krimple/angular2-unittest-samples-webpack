import {Component} from 'angular2/core';
import {AlertMessage} from './alert-message';
import {CORE_DIRECTIVES} from 'angular2/common';
@Component({
    selector: 'alert',
    properties: ['message'],
    directives: [CORE_DIRECTIVES],
    template: `
        <div class="alert alert-info alert-dismissable"
             data-dismiss="lower"
             *ngIf="lower !== undefined && lower === true">
            {{ message.text }}
            <button type="button" class="close" aria-label="Close" (click)="dismiss()">
            &times;
            </button>
        </div>
    `
})
export class Alert {
  private lower: boolean = false;
  dismiss(): void {
    this.lower = true;
  }
}
