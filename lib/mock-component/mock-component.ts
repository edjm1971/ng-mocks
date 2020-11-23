import { core } from '@angular/compiler';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  Injector,
  Query,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { getTestBed } from '@angular/core/testing';

import { directiveResolver } from '../common/core.reflect';
import { Type } from '../common/core.types';
import { getMockedNgDefOf } from '../common/func.get-mocked-ng-def-of';
import { MockControlValueAccessor } from '../common/mock-control-value-accessor';
import ngMocksUniverse from '../common/ng-mocks-universe';
import decorateDeclaration from '../mock/decorate-declaration';

import { MockedComponent } from './types';

export function MockComponents(...components: Array<Type<any>>): Array<Type<MockedComponent<any>>> {
  return components.map(MockComponent);
}

/**
 * @see https://github.com/ike18t/ng-mocks#how-to-mock-a-component
 */
export function MockComponent<TComponent>(component: Type<TComponent>): Type<MockedComponent<TComponent>> {
  // we are inside of an 'it'.
  // It's fine to to return a mock copy or to throw an exception if it wasn't replaced with its mock copy in TestBed.
  if ((getTestBed() as any)._instantiated) {
    try {
      return getMockedNgDefOf(component, 'c');
    } catch (error) {
      // looks like an in-test mock.
    }
  }
  if (ngMocksUniverse.flags.has('cacheComponent') && ngMocksUniverse.cacheDeclarations.has(component)) {
    return ngMocksUniverse.cacheDeclarations.get(component);
  }

  let meta: core.Directive | undefined;
  try {
    meta = directiveResolver.resolve(component);
  } catch (e) {
    /* istanbul ignore next */
    throw new Error('ng-mocks is not in JIT mode and cannot resolve declarations');
  }
  const { exportAs, inputs, outputs, queries, selector, providers } = meta;

  let template = `<ng-content></ng-content>`;
  const viewChildRefs = new Map<string, string>();
  /* istanbul ignore else */
  if (queries) {
    const queriesKeys = Object.keys(queries);
    const templateQueries = queriesKeys
      .map((key: string) => {
        const query: Query = queries[key];
        if (query.isViewQuery) {
          return ''; // ignoring all internal @ViewChild.
        }
        if (typeof query.selector !== 'string') {
          return ''; // in case of a mock component, Type based selector doesn't work properly anyway.
        }
        viewChildRefs.set(query.selector, key);
        queries[`__mockView_${key}`] = new ViewChild(`__${query.selector}`, {
          read: ViewContainerRef,
          static: false,
        } as any);

        return `<div *ngIf="mockRender_${query.selector}" data-key="${query.selector}"><ng-template #__${query.selector}></ng-template></div>`;
      })
      .join('');
    if (templateQueries) {
      template = `
        ${template}
        ${templateQueries}
      `;
    }
  }

  const config = ngMocksUniverse.config.get(component);

  class ComponentMock extends MockControlValueAccessor implements AfterContentInit {
    /* istanbul ignore next */
    public constructor(changeDetector: ChangeDetectorRef, injector: Injector) {
      super(injector);
      this.__ngMocksInstall(changeDetector);
    }

    public ngAfterContentInit(): void {
      if (!(this as any).__rendered && config && config.render) {
        for (const block of Object.keys(config.render)) {
          const { $implicit, variables } =
            config.render[block] !== true
              ? config.render[block]
              : {
                  $implicit: undefined,
                  variables: {},
                };
          (this as any).__render(block, $implicit, variables);
        }
        (this as any).__rendered = true;
      }
    }

    private __ngMocksInstall(changeDetector: ChangeDetectorRef): void {
      // Providing method to hide any @ContentChild based on its selector.
      (this as any).__hide = (contentChildSelector: string) => {
        const key = viewChildRefs.get(contentChildSelector);
        if (key) {
          (this as any)[`mockRender_${contentChildSelector}`] = false;
          changeDetector.detectChanges();
        }
      };

      // Providing a method to render any @ContentChild based on its selector.
      (this as any).__render = (contentChildSelector: string, $implicit?: any, variables?: Record<keyof any, any>) => {
        const key = viewChildRefs.get(contentChildSelector);
        let templateRef: TemplateRef<any>;
        let viewContainer: ViewContainerRef;
        if (key) {
          (this as any)[`mockRender_${contentChildSelector}`] = true;
          changeDetector.detectChanges();
          viewContainer = (this as any)[`__mockView_${key}`];
          templateRef = (this as any)[key];
          if (viewContainer && templateRef) {
            viewContainer.clear();
            viewContainer.createEmbeddedView(templateRef, { ...variables, $implicit } as any);
            changeDetector.detectChanges();
          }
        }
      };
    }
  }
  (ComponentMock as any).parameters = [ChangeDetectorRef, Injector];

  const mockMeta = {
    inputs,
    outputs,
    providers,
    queries,
  };
  const mockParams = {
    exportAs,
    selector,
    template,
  };
  const options = decorateDeclaration(component, ComponentMock, mockMeta, mockParams);
  Component(options)(ComponentMock);

  /* istanbul ignore else */
  if (ngMocksUniverse.flags.has('cacheComponent')) {
    ngMocksUniverse.cacheDeclarations.set(component, ComponentMock);
  }

  return ComponentMock as any;
}
