---
title: How to mock ActivatedRoute in Angular tests 
description: Mocking ActivatedRoute and its params in snapshot
sidebar_label: ActivatedRoute
---

When we are talking about mocking `ActivatedRoute`,
we mean a solution to provide stub params in the snapshot of `ActivatedRoute`
which are used in the component under test.

let's assume we have the next `TargetComponent` component,
which relies on the `paramId` of the `ActivatedRoute` snapshot. 

```ts
@Component({
  selector: 'target',
  template: '{{ param }}',
})
class TargetComponent {
  public param: string | null = null;

  public constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.param = this.route.snapshot.paramMap.get('paramId');
  }
}
```

In our test as a mock `ActivatedRoute`, we would like to provide `paramValue` as `paramId`.
To do so, we can use [`MockInstance`](/api/MockInstance.md).

The first step is to call a spy when someone wants to access `snapshot`: 

```ts
// for jasmine
MockInstance(ActivatedRoute, 'snapshot', jasmine.createSpy(), 'get');

// for jest
MockInstance(ActivatedRoute, 'snapshot', jest.fn(), 'get');
```

The second step is to return the stub params:

```ts
// for jasmine
MockInstance(ActivatedRoute, 'snapshot', jasmine.createSpy(), 'get')
  .and.returnValue({
    paramMap: new Map([['paramId', 'paramValue']]),
  });

// for jest
MockInstance(ActivatedRoute, 'snapshot', jest.fn(), 'get')
  .mockReturnValue({
    paramMap: new Map([['paramId', 'paramValue']]),
  });
```

Profit. Now, when someone accesses `snapshot` of `ActivatedRoute`, the spy will be called,
which returns a stub `paramMap` with the params we wanted.


## RouterModule.forRoot

In situation when you want to mock a module which imports `RouterModule.forRoot`.

In this case, only the component under test should be kept:

```ts
// TargetModule and RouterModule.forRoot will be mocks
beforeEach(() => MockBuilder(
  TargetComponent, // keep
  TargetModule, // mock
));
```

## RouterModule.forChild

In situation when you want to mock a module which imports `RouterModule.forChild`,
you have to add `RouterModule.forRoot` to mocks too.

Otherwise, `ActivatedRoute` and other dependencies won't be available: 

```ts
// TargetModule, RouterModule.forChild and RouterModule.forRoot will be mocks
beforeEach(() => MockBuilder(
  TargetComponent, // keep
  [TargetModule, RouterModule.forRoot([])], // mock, add here RouterModule.forRoot([])
));
```

## Live example how to mock ActivatedRoute

- [Try it on CodeSandbox](https://codesandbox.io/s/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=/src/examples/MockActivatedRoute/test.spec.ts&initialpath=%3Fspec%3DMockActivatedRoute)
- [Try it on StackBlitz](https://stackblitz.com/github/help-me-mom/ng-mocks-sandbox/tree/tests?file=src/examples/MockActivatedRoute/test.spec.ts&initialpath=%3Fspec%3DMockActivatedRoute)

```ts title="https://github.com/help-me-mom/ng-mocks/blob/master/examples/MockActivatedRoute/test.spec.ts"
import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { MockBuilder, MockInstance, MockRender } from 'ng-mocks';

@Component({
  selector: 'route',
  template: '{{ param }}',
})
class RouteComponent implements OnInit {
  public param: string | null = null;

  public constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.param = this.route.snapshot.paramMap.get('paramId');
  }
}

@NgModule({
  declarations: [RouteComponent],
  imports: [
    RouterModule.forRoot([
      {
        path: 'test/:paramId',
        component: RouteComponent,
      },
    ]),
  ],
})
class TargetModule {}

describe('MockActivatedRoute', () => {
  // Resets customizations after each test, in our case of `ActivatedRoute`.
  MockInstance.scope();

  // Keeping RouteComponent as it is and mocking all declarations in TargetModule.
  beforeEach(() => MockBuilder(RouteComponent, TargetModule));

  it('uses paramId from ActivatedRoute', () => {
    // Let's set the params of the snapshot.
    MockInstance(
      ActivatedRoute,
      'snapshot',
      jasmine.createSpy(),
      'get',
    ).and.returnValue({
      paramMap: new Map([['paramId', 'paramValue']]),
    });
    // // in case of jest.
    // MockInstance(
    //   ActivatedRoute,
    //   'snapshot',
    //   jest.fn(),
    //   'get',
    // ).mockReturnValue({
    //   paramMap: new Map([['paramId', 'paramValue']]),
    // });

    // Rendering RouteComponent.
    const fixture = MockRender(RouteComponent);

    // Asserting it got the right paramId.
    expect(fixture.point.componentInstance.param).toEqual(
      'paramValue',
    );
  });
});
```
