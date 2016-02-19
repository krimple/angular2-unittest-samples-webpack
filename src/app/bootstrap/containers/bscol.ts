import {Component} from 'angular2/core';
import {COMMON_DIRECTIVES} from 'angular2/common';
import {NgClass} from 'angular2/common';
@Component({
  selector: 'bs-col',
  directives: [COMMON_DIRECTIVES, NgClass],
  inputs: ['cells'],
  template: `
        <div [ngClass]="colCells">
            <ng-content></ng-content>
        </div>
    `
})
export class BootstrapCol {
  cells: number;
  colCells: string;

  constructor() {
    if (this.cells) {
      console.log(this.cells);
      this.colCells = 'col-lg-' + this.cells;
      console.log(this.colCells);
    } else {
      this.colCells = 'col-lg-1';
      console.log(this.colCells);
    }
  }
}
