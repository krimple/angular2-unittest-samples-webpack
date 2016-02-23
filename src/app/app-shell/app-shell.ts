import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {BlogRoll} from '../blog-roll/blog-roll';

@Component({
  selector: 'app-shell',
  template: `
      <div class="container">
        <blog-roll (edit)="setBlog(blog)"></blog-roll>
      </div>
    `,
  directives: [CORE_DIRECTIVES, BlogRoll]
})
export class AppShell {

}
