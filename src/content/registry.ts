import type { ContentEntry } from '@/types/content';

// Learn — Fundamentals
import { variablesLesson } from './learn/fundamentals/variables';
import { operatorsLesson } from './learn/fundamentals/operators';
import { functionsLesson } from './learn/fundamentals/functions';
import { scopeLesson } from './learn/fundamentals/scope';
import { arraysLesson } from './learn/fundamentals/arrays';
import { objectsLesson } from './learn/fundamentals/objects';
import { loopsLesson } from './learn/fundamentals/loops';
import { domLesson } from './learn/fundamentals/dom';
import { eventsLesson } from './learn/fundamentals/events';
import { modulesLesson } from './learn/fundamentals/modules';
import { errorHandlingLesson } from './learn/fundamentals/error-handling';
import { typeCoercionLesson } from './learn/fundamentals/type-coercion';
import { mapsSetsLesson } from './learn/fundamentals/maps-sets';
import { modulesEsmCjsLesson } from './learn/fundamentals/modules-esm-cjs';
import { generatorsLesson } from './learn/fundamentals/generators';

// Learn — Closures (existing)
import { closuresLesson } from './learn/closures';

// Learn — Advanced
import { prototypesLesson } from './learn/advanced/prototypes';
import { thisKeywordLesson } from './learn/advanced/this-keyword';
import { executionContextLesson } from './learn/advanced/execution-context';
import { functionalPatternsLesson } from './learn/advanced/functional-patterns';
import { memoryPerformanceLesson } from './learn/advanced/memory-performance';
import { designPatternsLesson } from './learn/advanced/design-patterns';
import { garbageCollectionLesson } from './learn/advanced/garbage-collection';
import { memoryLeaksLesson } from './learn/advanced/memory-leaks';
import { proxyReflectLesson } from './learn/advanced/proxy-reflect';

// Learn — Async
import { eventLoopLesson } from './learn/async/event-loop';
import { callbacksLesson } from './learn/async/callbacks';
import { promisesLesson } from './learn/async/promises';
import { asyncAwaitLesson } from './learn/async/async-await';
import { concurrencyLesson } from './learn/async/concurrency';
import { abortControllerLesson } from './learn/async/abort-controller';
import { microMacroTasksLesson } from './learn/async/micro-macro-tasks';
import { serviceWorkersLesson } from './learn/async/service-workers';
import { webWorkersLesson } from './learn/async/web-workers';

// Learn — Browser APIs
import { fetchLesson } from './learn/browser/fetch';
import { localStorageLesson } from './learn/browser/local-storage';
import { sessionStorageLesson } from './learn/browser/session-storage';
import { clipboardLesson } from './learn/browser/clipboard';
import { historyLesson } from './learn/browser/history';
import { geolocationLesson } from './learn/browser/geolocation';
import { intersectionObserverLesson } from './learn/browser/intersection-observer';
import { websocketsLesson } from './learn/browser/websockets';
import { notificationsLesson } from './learn/browser/notifications';
import { fileApisLesson } from './learn/browser/file-apis';
import { indexeddbLesson } from './learn/browser/indexeddb';
import { webCryptoLesson } from './learn/browser/web-crypto';
import { pointerEventsLesson } from './learn/browser/pointer-events';

// Reference — Array
import { arrayMapReference } from './reference/array/map';
import { arrayFilterReference } from './reference/array/filter';
import { arrayReduceReference } from './reference/array/reduce';
import { arrayForEachReference } from './reference/array/foreach';
import { arrayFindReference } from './reference/array/find';
import { arraySomeEveryReference } from './reference/array/some-every';
import { arrayFlatReference } from './reference/array/flat';
import { arrayFlatFlatMapReference } from './reference/array/flat-flatmap';
import { typedArraysReference } from './reference/array/typed-arrays';
import { arraySortReference } from './reference/array/sort';
import { arraySliceSpliceReference } from './reference/array/slice-splice';

// Reference — String
import { stringSplitReference } from './reference/string/split';
import { stringReplaceReference } from './reference/string/replace';
import { stringMatchReference } from './reference/string/match';
import { stringIncludesReference } from './reference/string/includes';
import { stringTrimReference } from './reference/string/trim';

// Reference — Object
import { objectKeysReference } from './reference/object/keys';
import { objectValuesReference } from './reference/object/values';
import { objectEntriesReference } from './reference/object/entries';
import { objectAssignReference } from './reference/object/assign';
import { objectFreezeReference } from './reference/object/freeze';

// Reference — Math, RegExp, Globals
import { mathDeepDiveReference } from './reference/math/deep-dive';
import { regexpDeepDiveReference } from './reference/regexp/deep-dive';
import { intlReference } from './reference/globals/intl';
import { temporalReference } from './reference/globals/temporal';
import { urlReference } from './reference/globals/url';

// Recipes
import { debouncingRecipe } from './recipes/debouncing';
import { formValidationRecipe } from './recipes/form-validation';
import { fileUploadRecipe } from './recipes/file-upload';
import { paginationRecipe } from './recipes/pagination';
import { searchUiRecipe } from './recipes/search-ui';
import { infiniteScrollRecipe } from './recipes/infinite-scroll';
import { apiRetriesRecipe } from './recipes/api-retries';
import { errorFallbackRecipe } from './recipes/error-fallback';
import { realtimeUpdatesRecipe } from './recipes/realtime-updates';
import { dashboardPatternsRecipe } from './recipes/dashboard-patterns';
import { authUiPatternsRecipe } from './recipes/auth-ui-patterns';
import { darkModeRecipe } from './recipes/dark-mode';
import { dragAndDropRecipe } from './recipes/drag-and-drop';
import { globalStateRecipe } from './recipes/global-state';
import { imageLazyLoadingRecipe } from './recipes/image-lazy-loading';
import { routeGuardsRecipe } from './recipes/route-guards';
import { skeletonLoadersRecipe } from './recipes/skeleton-loaders';
import { virtualizedListsRecipe } from './recipes/virtualized-lists';

// Integrations
import { restApisIntegration } from './integrations/rest-apis';
import { stripeIntegration } from './integrations/stripe';
import { graphqlIntegration } from './integrations/graphql';
import { openaiIntegration } from './integrations/openai';
import { webrtcIntegration } from './integrations/webrtc';
import { firebaseIntegration } from './integrations/firebase';
import { pushNotificationsIntegration } from './integrations/push-notifications';
import { telegramIntegration } from './integrations/telegram';
import { youtubeIntegration } from './integrations/youtube';
import { oauthIntegration } from './integrations/oauth';
import { paymentsIntegration } from './integrations/payments';
import { authFlowsIntegration } from './integrations/auth-flows';
import { realtimeIntegration } from './integrations/realtime';

// Projects
import { telegramBotProject } from './projects/telegram-bot';
import { kanbanBoardProject } from './projects/kanban-board';
import { ecommerceCartProject } from './projects/ecommerce-cart';
import { collaborativeEditorProject } from './projects/collaborative-editor';
import { musicPlayerProject } from './projects/music-player';
import { youtubeSearchProject } from './projects/youtube-search';
import { chatAppProject } from './projects/chat-app';
import { adminDashboardProject } from './projects/admin-dashboard';
import { notesAppProject } from './projects/notes-app';
import { analyticsDashboardProject } from './projects/analytics-dashboard';
import { crudAppProject } from './projects/crud-app';

// Explore
import { librariesExplore } from './explore/libraries';
import { testingExplore } from './explore/testing';
import { ciCdExplore } from './explore/ci-cd';
import { securityExplore } from './explore/security';
import { accessibilityExplore } from './explore/accessibility';
import { webVitalsExplore } from './explore/web-vitals';
import { apisExplore } from './explore/apis';
import { toolingExplore } from './explore/tooling';
import { glossaryExplore } from './explore/glossary';
import { comparisonsExplore } from './explore/comparisons';

// Errors
import { commonErrorsGuide } from './errors/common';
import { asyncErrorsGuide } from './errors/async';
import { domErrorsGuide } from './errors/dom';
import { apiErrorsGuide } from './errors/api';
import { debuggingGuide } from './errors/debugging';

export const contentRegistry: ContentEntry[] = [
  // Learn — Fundamentals
  variablesLesson,
  operatorsLesson,
  functionsLesson,
  scopeLesson,
  arraysLesson,
  objectsLesson,
  loopsLesson,
  domLesson,
  eventsLesson,
  modulesLesson,
  errorHandlingLesson,
  typeCoercionLesson,
  mapsSetsLesson,
  modulesEsmCjsLesson,
  generatorsLesson,
  closuresLesson,
  // Learn — Advanced
  prototypesLesson,
  thisKeywordLesson,
  executionContextLesson,
  functionalPatternsLesson,
  memoryPerformanceLesson,
  designPatternsLesson,
  garbageCollectionLesson,
  memoryLeaksLesson,
  proxyReflectLesson,
  // Learn — Async
  eventLoopLesson,
  callbacksLesson,
  promisesLesson,
  asyncAwaitLesson,
  concurrencyLesson,
  abortControllerLesson,
  microMacroTasksLesson,
  serviceWorkersLesson,
  webWorkersLesson,
  // Learn — Browser APIs
  fetchLesson,
  localStorageLesson,
  sessionStorageLesson,
  clipboardLesson,
  historyLesson,
  geolocationLesson,
  intersectionObserverLesson,
  websocketsLesson,
  notificationsLesson,
  fileApisLesson,
  indexeddbLesson,
  webCryptoLesson,
  pointerEventsLesson,
  // Reference — Array
  arrayMapReference,
  arrayFilterReference,
  arrayReduceReference,
  arrayForEachReference,
  arrayFindReference,
  arraySomeEveryReference,
  arrayFlatReference,
  arrayFlatFlatMapReference,
  typedArraysReference,
  arraySortReference,
  arraySliceSpliceReference,
  // Reference — String
  stringSplitReference,
  stringReplaceReference,
  stringMatchReference,
  stringIncludesReference,
  stringTrimReference,
  // Reference — Object
  objectKeysReference,
  objectValuesReference,
  objectEntriesReference,
  objectAssignReference,
  objectFreezeReference,
  // Reference — Math, RegExp, Globals
  mathDeepDiveReference,
  regexpDeepDiveReference,
  intlReference,
  temporalReference,
  urlReference,
  // Recipes
  debouncingRecipe,
  formValidationRecipe,
  fileUploadRecipe,
  paginationRecipe,
  searchUiRecipe,
  infiniteScrollRecipe,
  apiRetriesRecipe,
  errorFallbackRecipe,
  realtimeUpdatesRecipe,
  dashboardPatternsRecipe,
  authUiPatternsRecipe,
  darkModeRecipe,
  dragAndDropRecipe,
  globalStateRecipe,
  imageLazyLoadingRecipe,
  routeGuardsRecipe,
  skeletonLoadersRecipe,
  virtualizedListsRecipe,
  // Integrations
  restApisIntegration,
  telegramIntegration,
  youtubeIntegration,
  oauthIntegration,
  paymentsIntegration,
  authFlowsIntegration,
  realtimeIntegration,
  stripeIntegration,
  graphqlIntegration,
  openaiIntegration,
  webrtcIntegration,
  firebaseIntegration,
  pushNotificationsIntegration,
  // Projects
  telegramBotProject,
  youtubeSearchProject,
  chatAppProject,
  adminDashboardProject,
  notesAppProject,
  analyticsDashboardProject,
  crudAppProject,
  kanbanBoardProject,
  ecommerceCartProject,
  collaborativeEditorProject,
  musicPlayerProject,
  // Explore
  librariesExplore,
  apisExplore,
  toolingExplore,
  glossaryExplore,
  comparisonsExplore,
  testingExplore,
  ciCdExplore,
  securityExplore,
  accessibilityExplore,
  webVitalsExplore,
  // Errors
  commonErrorsGuide,
  asyncErrorsGuide,
  domErrorsGuide,
  apiErrorsGuide,
  debuggingGuide,
];
