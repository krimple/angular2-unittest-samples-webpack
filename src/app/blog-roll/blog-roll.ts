import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {Router} from 'angular2/router';
import {Response} from 'angular2/http';
import {BlogEntry} from '../domain/blog-entry.ts';
import {BlogService} from '../services/blog-service';
import {MarkdownService} from '../services/markdown-service';
import {BootstrapCol} from '../bootstrap/containers/bscol';
import {BootstrapRow} from '../bootstrap/containers/bsrow';

@Component({
    bindings: [BlogService, MarkdownService],
    template: `
    <div *ngFor="#blog of blogs">
      <div class="row">
        <div class="col-lg-1"></div>
        <div class="col-lg-5">
          <h3><button class="btn-sm btn btn-default"
                    (click)="editBlogEntry(blog)">Edit</button> &nbsp;{{ blog.title }}
          </h3>
        </div>
      </div>
      <div class="title">Content (Rendered)</div>
      <div class="row panel">

        <div class="col-lg-1"></div>
        <div class="col-lg-8"
               [innerHtml]="blog.contentRendered"></div>
      </div>
    </div>
    `,
    selector: 'blog-roll',
    directives: [CORE_DIRECTIVES, BootstrapRow, BootstrapCol]
})
export class BlogRoll {
    blogs: Array<BlogEntry>;
    router: Router;
    message: string;
    markdownService: MarkdownService;

    constructor(private blogService: BlogService,
                markdownService: MarkdownService,
                router: Router) {
        console.log('***** Initializing BlogRoll component ********');
        this.markdownService = markdownService;
        this.router = router;
        this.loadBlogEntries();
    }

    loadBlogEntries() {
        this.blogService.getBlogs().subscribe(
            (data: Array<BlogEntry>) => {
                console.log('data is', data);
                this.blogs = data;
            },
            (error: Object) => {
                console.log('error!', error);
            }
        );
    }

    render(blog: BlogEntry) {
        if (blog.contentMarkdown) {
            blog.contentRendered = this.markdownService.toHtml(blog.contentMarkdown);
            this.blogService
                .saveBlog(blog)
                .subscribe(
                    () => this.message = 'update complete',
                    (error) => { console.log(error); }
                );
        }
    }

    editBlogEntry(blog: BlogEntry) {
        console.log('saving', blog);
        this.blogService.saveBlog(blog)
            .subscribe(
                (res: Response) => {
                    this.router.navigate(['BlogEditorById', { id: blog.id.toString() }]);
                },
                (error: Object) => {
                    console.log('error saving!', error);
                }
            );
    }

    clearMessage() {
        this.message = undefined;
    }
}
