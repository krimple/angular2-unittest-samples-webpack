import {BootstrapContainer} from '../bootstrap/containers/container';
import {MessageService} from '../services/message-service';
import {MenuBar} from '../bootstrap/components/menubar/menubar';
import {Alert} from '../bootstrap/components/alert/alert';
import {AlertMessage} from '../bootstrap/components/alert/alert-message';
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
  directives: [CORE_DIRECTIVES, BlogRoll, BootstrapContainer]
})
export class AppShell {

}
