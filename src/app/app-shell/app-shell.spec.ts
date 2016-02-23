import {AppShell} from "../app-shell/app-shell";
import {
    it,
    inject,
    injectAsync,
    beforeEachProviders,
    TestComponentBuilder
} from 'angular2/testing';
import {BlogRoll} from '../blog-roll/blog-roll';
import {BlogEntry} from '../domain/blog-entry';
import {provide} from 'angular2/core';
import {BlogEditor} from '../blog-editor/blog-editor';
import {Component} from 'angular2/core';

describe('Application Shell', () => {
    var shell: AppShell;

    beforeEachProviders(() => {
        return [
            provide(BlogRoll, {useClass: FakeBlogRoll}),
            provide(BlogEditor, {useClass: FakeBlogEditor})
        ];
    });

    it('Can be created', injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(AppShell)
            .then((fixture) => {
                fixture.detectChanges();
                let blogRoll = fixture.nativeElement.getElementsByTagName('<blog-roll>');
                expect(blogRoll).toBeDefined();
            });
    }));
});
