import {
  it,
  xit,
  describe,
  expect,
  inject,
  injectAsync,
  beforeEach,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';
import {provide} from 'angular2/src/core/di/provider';
import {BlogRoll} from './blog-roll';
import {BlogEntry} from '../domain/blog-entry';
import {BlogService} from '../services/blog-service';
import {MarkdownService} from '../services/markdown-service';
import {MockBackend} from 'angular2/src/http/backends/mock_backend';
import {Observable} from 'rxjs/Rx';

class MockMarkdownService extends MarkdownService {
  toHtml(text: string): string {
    return text;
  }
}
class MockBlogService extends BlogService {
  constructor() {
    super(null);
  }

  getBlogs() {
    console.log('sending fake answers!');
    return Observable.of([
      {
        id: 26,
        title: 'The title',
        contentRendered: '<p><b>Hi there</b></p>',
        contentMarkdown: '*Hi there*'
      }
    ]);
  }
}

describe('Blog Roll Component...', () => {
  var mockBlogService;

  beforeEach(() => {
    mockBlogService = new MockBlogService();
  });

  it('shows list of blog items by default - unit', () => {
    let blogRoll: BlogRoll = new BlogRoll(null, null);
    blogRoll.ngOnInit().then(
      () => {
        expect(blogRoll.blogs.length).toBe(1);
        expect(blogRoll.blog).toBeUndefined();
        expect(blogRoll.editing).toBe(false);
      },
      (error) => {
        console.log('promise rejected, error is', error);
      });

  });

  it('shows list of blog items by default - tcb', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb
      .overrideProviders(BlogRoll, [provide(BlogService, {useValue: mockBlogService})])
      .createAsync(BlogRoll)
      .then((fixture) => {
        let nativeElement = fixture.nativeElement;
        fixture.detectChanges();

        // we start with the blog roll panel visible
        expect(fixture.componentInstance.editing).toBe(false);
        expect(nativeElement.querySelector('#blog-editor-panel') === null).toBe(true);
        expect(nativeElement.querySelector('#blog-roll-panel') === null).toBe(false);

        // trigger the 'new' button and swap visible panels
        fixture.nativeElement.querySelector('i.glyphicon-plus-sign').click();
        fixture.detectChanges();
        expect(fixture.componentInstance.editing).toBe(true);
        expect(nativeElement.querySelector('#blog-editor-panel') === null).toBe(false);
        expect(nativeElement.querySelector('#blog-roll-panel') === null).toBe(true);
      });
  }));

  it('should show blog editor div when New is clicked...',
    injectAsync([TestComponentBuilder], (tcb) => {
      return tcb
        .overrideProviders(BlogRoll, [provide(BlogService, {useValue: mockBlogService})])
        .createAsync(BlogRoll)
        .then((fixture) => {
          let nativeElement = fixture.nativeElement;
          fixture.detectChanges();

          // we start with the blog roll panel visible
          expect(fixture.componentInstance.editing).toBe(false);
          expect(nativeElement.querySelector('#blog-editor-panel') === null).toBe(true);
          expect(nativeElement.querySelector('#blog-roll-panel') === null).toBe(false);

          // trigger the 'new' button and swap visible panels
          fixture.nativeElement.querySelector('i.glyphicon-plus-sign').click();
          fixture.detectChanges();
          expect(fixture.componentInstance.editing).toBe(true);
          expect(nativeElement.querySelector('#blog-editor-panel') === null).toBe(false);
          expect(nativeElement.querySelector('#blog-roll-panel') === null).toBe(true);
        });
    }));

  it('should open the editing pane if the edit button is clicked',
    injectAsync([TestComponentBuilder], (tcb) => {
      return tcb
        .overrideProviders(BlogRoll, [provide(BlogService, {useValue: mockBlogService})])
        .createAsync(BlogRoll)
        .then((fixture) => {
          let nativeElement = fixture.nativeElement;
          fixture.detectChanges();
          nativeElement.querySelector('i.glyphicon-edit').click();
          fixture.detectChanges();
          expect(fixture.componentInstance.editing).toBe(true);
          let blog = fixture.componentInstance.blog;
          expect(blog).toBeDefined();
          expect(blog.id).toBeDefined();
        });
    }));
});


