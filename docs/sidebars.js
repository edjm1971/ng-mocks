module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      items: ['index', 'tl-dr', 'extra/install', 'extra/quick-start', 'extra/extensive-example'],
    },
    {
      type: 'category',
      label: 'Classic tools',
      collapsed: false,
      items: [
        'api/MockComponent',
        'api/MockDirective',
        'api/MockPipe',
        'api/MockProvider',
        'api/MockService',
        'api/MockModule',
        'extra/templateref',
      ],
    },
    {
      type: 'category',
      label: 'Contemporary tools',
      collapsed: false,
      items: ['api/MockBuilder', 'api/MockRender', 'api/MockInstance'],
    },
    {
      type: 'category',
      label: 'ngMocks',
      items: [
        'api/ngMocks',
        'api/ngMocks/defaultMock',
        'api/ngMocks/globalExclude',
        'api/ngMocks/globalKeep',
        'api/ngMocks/globalMock',
        'api/ngMocks/globalReplace',
        'api/ngMocks/globalWipe',
        'api/ngMocks/change',
        'api/ngMocks/touch',
        'api/ngMocks/click',
        'api/ngMocks/trigger',
        'api/ngMocks/event',
        'api/ngMocks/render',
        'api/ngMocks/hide',
        'api/ngMocks/input',
        'api/ngMocks/output',
        'api/ngMocks/find',
        'api/ngMocks/findAll',
        'api/ngMocks/reveal',
        'api/ngMocks/revealAll',
        'api/ngMocks/get',
        'api/ngMocks/findInstance',
        'api/ngMocks/findInstances',
        'api/ngMocks/findTemplateRef',
        'api/ngMocks/findTemplateRefs',
        'api/ngMocks/crawl',
        'api/ngMocks/stub',
        'api/ngMocks/stubMember',
        'api/ngMocks/guts',
        'api/ngMocks/faster',
        'api/ngMocks/throwOnConsole',
        'api/ngMocks/formatHtml',
        'api/ngMocks/formatText',
        'api/ngMocks/flushTestBed',
        'api/ngMocks/reset',
      ],
    },
    {
      type: 'category',
      label: 'Helper functions',
      items: [
        'api/helpers/isMockControlValueAccessor',
        'api/helpers/isMockValidator',
        'api/helpers/isMockOf',
        'api/helpers/isMockedNgDefOf',
        'api/helpers/getMockedNgDefOf',
        'api/helpers/isNgDef',
        'api/helpers/getSourceOfMock',
        'api/helpers/isNgInjectionToken',
      ],
    },
    {
      type: 'doc',
      id: 'extra/auto-spy',
    },
    {
      type: 'category',
      label: 'Extra',
      items: [
        'extra/customize-mocks',
        'extra/mock-observables',
        'extra/mock-form-controls',
        'extra/sanitizer',
        'extra/with-3rd-party',
      ],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      items: [
        'troubleshooting/read-property-of-undefined',
        'troubleshooting/declarations-of-2-modules',
        'troubleshooting/no-selector',
        'troubleshooting/not-a-known-element',
        'troubleshooting/internals-vs-externals',
        'troubleshooting/browser-animations-module',
      ],
    },
    {
      type: 'doc',
      id: 'migrations',
    },
    {
      type: 'doc',
      id: 'need-help',
    },
    {
      type: 'doc',
      id: 'credits',
    },
  ],
  guides: [
    {
      type: 'doc',
      id: 'guides',
    },
    {
      type: 'category',
      label: 'How to test',
      collapsed: false,
      items: [
        'guides/component',
        'guides/component-provider',
        'guides/directive-attribute',
        'guides/directive-provider',
        'guides/directive-structural',
        'guides/directive-structural-context',
        'guides/pipe',
        'guides/view-child',
        'guides/ngonchanges',
        'guides/provider',
        'guides/token',
        'guides/token-multi',
        'guides/lazy-loaded-module',
        'guides/route',
        'guides/routing-guard',
        'guides/routing-resolver',
        'guides/http-request',
        'guides/http-interceptor',
      ],
    },
    {
      type: 'category',
      label: 'Testing libraries',
      collapsed: false,
      items: [
        'guides/libraries/ng-select',
        'guides/libraries/angular-material',
        'guides/libraries/primeng',
        'guides/libraries/ngrx',
      ],
    },
  ],
};
