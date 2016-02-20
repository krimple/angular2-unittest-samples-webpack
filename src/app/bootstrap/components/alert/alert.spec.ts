import {
  beforeEach, describe, expect, it, injectAsync, TestComponentBuilder
} from 'angular2/testing';

import {Alert} from './alert';


describe('Alert Component', () => {

  var fixture;

  beforeEach(injectAsync([TestComponentBuilder], (tcb) => {
      return tcb.createAsync(Alert).then((_fixture_) => {
      fixture = _fixture_;
    });
  }));

  it('should display message', () => {
      fixture.debugElement.componentInstance.message = {text: "boo!"};
      fixture.detectChanges();
      var compiled = fixture.nativeElement.querySelector('.alert');
      expect(compiled.innerHTML).toContain("boo!");
  });

  it('should be dismissed when the button is checked', () => {
      fixture.debugElement.componentInstance.message = {text: "boo!"};
      fixture.detectChanges();
      fixture.debugElement.componentInstance.dismiss();
      fixture.detectChanges();
      var compiled = fixture.nativeElement.querySelector('.alert');
      expect(compiled.innerHTML).not.toContain("boo!");
  });

});
