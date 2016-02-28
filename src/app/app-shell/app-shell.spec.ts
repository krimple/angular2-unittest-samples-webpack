import {AppShell} from '../app-shell/app-shell';
import {
    it,
    xit,
    inject,
    injectAsync,
    beforeEachProviders,
    TestComponentBuilder
} from 'angular2/testing';
import {BlogRoll} from '../blog-roll/blog-roll';
import {BlogEntry} from '../domain/blog-entry';
import {provide} from 'angular2/core';
import {Component} from 'angular2/core';
import {BlogService} from '../services/blog-service';

describe('Application Shell', () => {
    var shell: AppShell;

    beforeEachProviders(() => {
        return [
          BlogService,
          provide(BlogRoll, { useValue: { }})
        ];
    });

    xit('Can be created', injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(AppShell)
            .then((fixture) => {
                fixture.detectChanges();
                let blogRoll = fixture.nativeElement.getElementsByTagName('<blog-roll>');
                expect(blogRoll).toBeDefined();
            });
    }));
});
