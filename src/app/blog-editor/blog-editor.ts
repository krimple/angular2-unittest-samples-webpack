import {BlogEntry} from '../domain/blog-entry';
import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {BlogService} from '../services/blog-service';
import {FORM_DIRECTIVES} from 'angular2/common';
import {MarkdownService} from '../services/markdown-service';
import {Router} from 'angular2/router';
import {OnInit} from 'angular2/core';


@Component({
  providers: [BlogService, MarkdownService],
  directives: [FORM_DIRECTIVES],
  template: `
      <div class="jumbotron">
        <h3>Enter/edit your blog content below...</h3>
      </div>
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
 `
})
export class BlogEditor implements OnInit {
  blog: BlogEntry;

  constructor(private params: RouteParams,
              private markdownService: MarkdownService,
              private blogService: BlogService,
              private router: Router) { }

  ngOnInit() {
    // create a prototypical entry
    this.blog = new BlogEntry('', '', 'Enter your title', null);
    let id = this.params.get('id');
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
      this.router.navigate(['/BlogRoll']);
    });
  }
}
