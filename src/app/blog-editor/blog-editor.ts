import {BlogEntry} from '../domain/blog-entry';
import {Component} from 'angular2/core';
import {BlogService} from '../services/blog-service';
import {FORM_DIRECTIVES} from 'angular2/common';
import {MarkdownService} from '../services/markdown-service';
import {OnInit} from 'angular2/core';
import {Output} from 'angular2/core';
import {EventEmitter} from 'angular2/core';
import {Input} from 'angular2/core';

@Component({
  providers: [BlogService, MarkdownService],
  selector: 'blog-editor',
  directives: [FORM_DIRECTIVES],
  template: `
    <div class="modal fade" tabindex="-1" role="dialog">
     <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add/Edit Blog Entry</h4>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group row">
              <label for="blog-title" class="col-sm-2 form-control-label">Title</label>
              <div class="col-sm-10">
                <input id="blog-title" class="form-control" type="text" #title [(ngModel)]="blog.title">
              </div>
            </div>
            <div class="form-group row">
              <label for="blog-content" class="col-sm-2 form-control-label">Content</label>
              <div class="col-sm-10">
                  <textarea id="blog-content"
                    class="form-control"
                    #markdown
                    (keyup)="render(blog)"
                    [(ngModel)]="blog.contentMarkdown"></textarea>
              </div>
            </div>
            <button class="btn btn-primary" (click)="saveBlog(blog)">Save</button>
            <fieldset>
              <div class="form-group row">
                <div class="col-sm-2">&nbsp;</div>
                <label class="col-sm-2 form-control-label">Content Preview</label>
                <div class="jumbotron col-sm-8">
                  <div [innerHtml]="blog.contentRendered"></div>
                </div>
              </div>
            </fieldset>
          </form>
          </div>
     </div>
    </div>
 `
})
export class BlogEditor implements OnInit {
  @Output() refresh: EventEmitter<void> = new EventEmitter<void>();
  @Input() blog: BlogEntry;

  constructor(private markdownService: MarkdownService,
              private blogService: BlogService) {}

  ngOnInit() {
    // create a prototypical entry
    this.blog = new BlogEntry('', '', 'Enter your title', null);
    let id = null; // todo
    if (id) {
      this.blogService.getBlog(Number.parseInt(id))
        .subscribe((blogEntry: BlogEntry) => {
          this.blog = blogEntry;
        });
    }
  }

  render(blog: BlogEntry) {
    blog.contentRendered = this.markdownService.toHtml(blog.contentMarkdown);
    console.log('change', blog);
  }

  saveBlog(blog: BlogEntry) {
   this.blogService.saveBlog(blog)
    .subscribe(() => {
      this.refresh.emit(null);
    });
  }
}
