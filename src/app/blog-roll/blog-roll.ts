import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {Response} from 'angular2/http';
import {BlogEntry} from '../domain/blog-entry.ts';
import {BlogService} from '../services/blog-service';
import {MarkdownService} from '../services/markdown-service';
import {BootstrapCol} from '../bootstrap/containers/bscol';
import {BootstrapRow} from '../bootstrap/containers/bsrow';
import {OnInit} from 'angular2/core';

@Component({
    bindings: [BlogService, MarkdownService],
    template: `
    <div *ngFor="#blog of blogs">
      <div class="row">
        <div class="col-lg-1"></div>
        <div class="col-lg-5">
          <h3><a (click)="editBlogEntry(blog)" [routerLink]="['BlogEditorById', {id: blog.id}]">
                    {{ blog.title }}
               </a>
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
    directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES, BootstrapRow, BootstrapCol]
})
export class BlogRoll implements OnInit {
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
    }

    ngOnInit() {
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

    newBlogEntry() {
        this.router.navigate(['BlogEditor']);
    }

    editBlogEntry(blog: BlogEntry) {
        this.router.navigate(['BlogEditorById', { id: blog.id }]);
    }

    clearMessage() {
        this.message = undefined;
    }
}
