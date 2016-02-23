import {
  it,
  xit,
  describe,
  inject,
  injectAsync,
  beforeEach,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';
import {provide} from "angular2/src/core/di/provider";
import {BlogRoll} from "./blog-roll";
import {BlogEntry} from "../domain/blog-entry";
import {BlogService} from "../services/blog-service";
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

describe('Blog Roll Component', () => {
  var blogService: BlogService,
    markdownService: MarkdownService,
    html: string;

  beforeEachProviders(() => [
      HTTP_PROVIDERS,
      BlogService,
      provide(XHRBackend, {useClass: MockBackend}),
      provide(MarkdownService, {useClass: MockMarkdownService})
  ]);

  beforeEach(inject([BlogService, MarkdownService, ],
            (_blogService_, _markdownService_) => {
    blogService = _blogService_;
    markdownService = _markdownService_;
  }));

  beforeEach(inject([XHRBackend], (mockBackend) => {
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(new Response(
          new ResponseOptions({
              body: [
                {
                  id: 26,
                  title: "Why not?",
                  contentRendered: "<p><b>Hi there</b></p>",
                  contentMarkdown: "*Hi there*"
                }]
            }
          )));
      });
  }));

  it('Shows list of blog items by default', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb
      .overrideTemplate(BlogRoll, html)
      .createAsync(BlogRoll)
      .then((fixture) => {
        fixture.detectChanges();
        let nativeElement = fixture.nativeElement;
        // the element should always start as either undefined or null
        expect(nativeElement.querySelector('blog-editor') === undefined ||
               nativeElement.querySelector('blog-editor') === null).toBe(true);
        expect(nativeElement.querySelector('blog-content')).toBeDefined();

        let trs = nativeElement.querySelectorAll('tr');
        expect(trs.length).toBe(2);

        let tdTitleContent = trs[1].children[0].innerHtml;
        let tdRenderedContent = trs[1].children[1].innerHtml;
        expect(tdTitleContent).toContain('Why not?');
        expect(tdRenderedContent).toContain('Hi there');
      });
  }));

  //it('Can navigate to edit pane', injectAsync([TestComponentBuilder], (tcb) => {
  //  return tcb
  //    .overrideTemplate(BlogRoll, html)
  //    .createAsync(BlogRoll)
  //    .then((fixture) => {
  //      fixture.detectChanges();
  //      let result = fixture.componentInstance.editBlogEntry(
  //        fixture.componentInstance.blogs[0]
  //      );
  //      // return false for event bubble cancel
  //      expect(result).toBe(false);
  //      expect(router.navigate).toHaveBeenCalled();
  //    });
  //}));
});

class MockMarkdownService extends MarkdownService {
  toHtml(text: string): string {
    return text;
  }
}

