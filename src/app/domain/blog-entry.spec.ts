import {
  it,
  xit,
  describe,
  xdescribe,
  inject,
  injectAsync,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';

import { BlogEntry } from '../../../src/app/domain/blog-entry';

describe('Blog Entry Domain Class', () => {

  function createEntry() {
      return new BlogEntry('The title', 'The content, rendered', 'The content, markdown', 1);
  }

  it('should be createable by constructor', () => {
      let blogEntry = createEntry();
      expect(blogEntry.title).toBe('The title');
      expect(blogEntry.contentRendered).toBe('The content, rendered');
      expect(blogEntry.contentMarkdown).toBe('The content, markdown');
      expect(blogEntry.id).toBe(1);
  });

  it('can be transformed to json', () => {
      let blogEntry: any = createEntry();
      let json = blogEntry.json();
      let parsedEntry: any = JSON.parse(json);
      expect(parsedEntry.title).toBe(blogEntry.title);
      expect(parsedEntry.contentRendered).toBe(blogEntry.contentRendered);
      expect(parsedEntry.contentMarkdown).toBe(blogEntry.contentMarkdown);
      expect(parsedEntry.id).toBe(blogEntry.id);
  });

  it('can be parsed from a json string array', () => {
      let blogEntryJsonData: Array<Object> = [
        { "id": 1, "contentRendered": "Abc", "contentMarkdown": "def", "title": "title" },
        { "id": 3, "contentRendered": "Def", "contentMarkdown": "ghi", "title": "title2" }
      ];
      let blogEntries: BlogEntry[] = BlogEntry.asBlogEntries(blogEntryJsonData);
      expect(blogEntries[0].id).toBe(1);
      expect(blogEntries[1].id).toBe(3);
      expect(blogEntries[0].contentRendered).toBe('Abc');
      expect(blogEntries[1].contentRendered).toBe('Def');
      expect(blogEntries[0].contentMarkdown).toBe('def');
      expect(blogEntries[1].contentMarkdown).toBe('ghi');
      expect(blogEntries[0].title).toBe('title');
      expect(blogEntries[1].title).toBe('title2');
  });
});

