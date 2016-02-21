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
    <div class="jumbotron">
    <h3>This is a sample blog content editor</h3>
    </div>
    <p><a [routerLink]="['BlogEditor']"><i class="glyphicon glyphicon-plus-sign">Add...</i></a></p>
    <table class="table table-bordered table-condensed">
    <tr>
      <th>Actions</th>
      <th>Title</th>
      <th>Content</th>
    </tr>
    <tr *ngFor="#blog of blogs">
      <td>
        <a href="#" (click)="editBlogEntry(blog)"><i class="glyphicon glyphicon-edit"></i></a>
        &nbsp;
        <a href="#" (click)="deleteBlogEntry(blog)"><i class="glyphicon glyphicon-remove"></i></a>
      </td>
      <td class="table-cell">
        <span class="title">{{ blog.title }}</span>
      </td>
      <td>
        <div [innerHtml]="blog.contentRendered"></div>
      </td>
    </tr>
  </table>
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
        this.markdownService = markdownService;
        this.router = router;
    }

    ngOnInit() {
        this.loadBlogEntries();
    }

    loadBlogEntries() {
        this.blogService.getBlogs().subscribe(
            (data: Array<BlogEntry>) => {
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
        return false;
    }

    deleteBlogEntry(blog: BlogEntry) {
      if(confirm(`Are you sure you want to delete this blog entry (${blog.title})?`)) {
        this.blogService.deleteBlogEntry(blog.id)
          .subscribe(
            () => { this.loadBlogEntries; },
            (err) => { alert(`Delete failed. Reason: ${err}`); } );
      }
    }

    clearMessage() {
        this.message = undefined;
    }
}
