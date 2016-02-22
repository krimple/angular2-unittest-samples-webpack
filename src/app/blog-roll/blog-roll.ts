import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {Response} from 'angular2/http';
import {BlogEntry} from '../domain/blog-entry.ts';
import {BlogService} from '../services/blog-service';
import {MarkdownService} from '../services/markdown-service';
import {OnInit} from 'angular2/core';
import {EventEmitter} from 'angular2/core';
import {Output} from 'angular2/core';
import {BlogEditor} from '../blog-editor/blog-editor';

@Component({
    bindings: [BlogService, MarkdownService],
    template: `
    <blog-editor
         [blog]="blog"
         (refresh)="refresh()"></blog-editor>
    <div class="row">
     <div class="col-sm-12">
      <p><a (click)="newBlogEntry()"><i class="glyphicon glyphicon-plus-sign">Add...</i></a></p>
      <table class="table table-bordered table-condensed">
        <tr>
          <th>Actions</th>
          <th>Title</th>
          <th>Content</th>
        </tr>
        <tr *ngFor="#blog of blogs">
         <td>
            <a href="#" (click)="editBlogEntry(blog)">
              <i class="glyphicon glyphicon-edit"></i>
            </a>
          &nbsp;
            <a href="#" (click)="deleteBlogEntry(blog)">
              <i class="glyphicon glyphicon-remove"></i>
            </a>
         </td>
         <td class="table-cell">
            <span class="title">{{ blog.title }}</span>
         </td>
         <td>
           <div [innerHtml]="blog.contentRendered"></div>
         </td>
        </tr>
      </table>
      </div>
  </div>
    `,
    selector: 'blog-roll',
    directives: [CORE_DIRECTIVES, BlogEditor]
})
export class BlogRoll implements OnInit {
    blogs: Array<BlogEntry>;
    blog: BlogEntry;

    message: string;

    constructor(private blogService: BlogService,
                private markdownService: MarkdownService) {
    }

    ngOnInit() {
        this.loadBlogEntries();
    }

    refresh() {
        this.loadBlogEntries();
        this.blog = undefined;
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
                    (error) => {
                        console.log(error);
                    }
                );
        }
    }

    newBlogEntry() {
        this.blog = new BlogEntry("", "", "", undefined);
    }

    editBlogEntry(blog: BlogEntry) {
        this.blog = blog;
    }

    deleteBlogEntry(blog: BlogEntry) {
        if (confirm(`Are you sure you want to delete this blog entry (${blog.title})?`)) {
            this.blogService.deleteBlogEntry(blog.id)
                .subscribe(
                    () => {
                        this.loadBlogEntries();
                        this.blog = undefined;
                    },
                    (err) => {
                        alert(`Delete failed. Reason: ${err}`);
                    });
        }
    }

    clearMessage() {
        this.message = undefined;
    }
}


