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
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {MarkdownService} from '../services/markdown-service';
import {MockBackend} from 'angular2/src/http/backends/mock_backend';
import {XHRBackend} from 'angular2/http';
import {HTTP_PROVIDERS} from 'angular2/http';
import {MockConnection} from 'angular2/src/http/backends/mock_backend';
import {ResponseOptions} from 'angular2/http';
import {Response} from 'angular2/http';
import {Instruction} from 'angular2/router';
import {Component} from 'angular2/core';

describe('Blog Roll Component...', () => {
  var blogService: BlogService,
    markdownService: MarkdownService,
    mockBackend: MockBackend,
    html: string;

  beforeEachProviders(() => [
    BlogService,
    HTTP_PROVIDERS,
    provide(XHRBackend, {useClass: MockBackend}),
    provide(MarkdownService, {useClass: MockMarkdownService})
  ]);

  beforeEach(
    inject([BlogService, MarkdownService, XHRBackend], (_blogService_, _markdownService_, _mockBackend_) => {
      blogService = _blogService_;
      markdownService = _markdownService_;
      mockBackend = _mockBackend_;
    }));

  beforeEach(() => {
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(new Response(
          new ResponseOptions({
              body: [
                {
                  id: 26,
                  title: 'The title',
                  contentRendered: '<p><b>Hi there</b></p>',
                  contentMarkdown: '*Hi there*'
                }
              ]
          })));
      });
  });


  it('Shows list of blog items by default', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb
      .createAsync(BlogRoll)
      .then((fixture) => {
        fixture.detectChanges();
        let nativeElement = fixture.nativeElement;
        // start with editor panel hidden and blog roll visible
        expect(nativeElement.querySelector('#blog-editor-panel') === null).toBe(true);
        expect(nativeElement.querySelector('#blog-roll-panel') === null).toBe(false);

        // make sure we have two rows - one for the heading and one for data
        let trs = nativeElement.querySelectorAll('tr');
        expect(trs.length).toBe(2);

        let tdTitleContent = trs[1].children[1].innerHTML;
        let tdRenderedContent = trs[1].children[2].innerHTML;
        expect(tdTitleContent).toContain('The title');
        expect(tdRenderedContent).toContain('Hi there');
      });
  }));

  it('should show blog editor div when New is clicked...',
    injectAsync([TestComponentBuilder], (tcb) => {
    return tcb
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
  it('should open the editing pane if the edit button is clicked',
    injectAsync([TestComponentBuilder], (tcb) => {
    return tcb
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

class MockMarkdownService extends MarkdownService {
  toHtml(text: string): string {
    return text;
  }
}

