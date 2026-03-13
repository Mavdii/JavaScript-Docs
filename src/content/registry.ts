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

// Learn — Closures (existing)
import { closuresLesson } from './learn/closures';

// Learn — Advanced
import { prototypesLesson } from './learn/advanced/prototypes';
import { thisKeywordLesson } from './learn/advanced/this-keyword';
import { executionContextLesson } from './learn/advanced/execution-context';
import { functionalPatternsLesson } from './learn/advanced/functional-patterns';
import { memoryPerformanceLesson } from './learn/advanced/memory-performance';

// Learn — Async
import { eventLoopLesson } from './learn/async/event-loop';
import { callbacksLesson } from './learn/async/callbacks';
import { promisesLesson } from './learn/async/promises';
import { asyncAwaitLesson } from './learn/async/async-await';
import { concurrencyLesson } from './learn/async/concurrency';

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

// Reference — Array
import { arrayMapReference } from './reference/array-map';
import { arrayFilterReference } from './reference/array/filter';
import { arrayReduceReference } from './reference/array/reduce';
import { arrayForEachReference } from './reference/array/foreach';
import { arrayFindReference } from './reference/array/find';
import { arraySomeEveryReference } from './reference/array/some-every';
import { arrayFlatReference } from './reference/array/flat';
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

// Integrations
import { restApisIntegration } from './integrations/rest-apis';
import { telegramIntegration } from './integrations/telegram';
import { youtubeIntegration } from './integrations/youtube';
import { oauthIntegration } from './integrations/oauth';
import { paymentsIntegration } from './integrations/payments';
import { authFlowsIntegration } from './integrations/auth-flows';
import { realtimeIntegration } from './integrations/realtime';

// Projects
import { telegramBotProject } from './projects/telegram-bot';
import { youtubeSearchProject } from './projects/youtube-search';
import { chatAppProject } from './projects/chat-app';
import { adminDashboardProject } from './projects/admin-dashboard';
import { notesAppProject } from './projects/notes-app';
import { analyticsDashboardProject } from './projects/analytics-dashboard';
import { crudAppProject } from './projects/crud-app';

// Explore
import { librariesExplore } from './explore/libraries';
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
  closuresLesson,
  // Learn — Advanced
  prototypesLesson,
  thisKeywordLesson,
  executionContextLesson,
  functionalPatternsLesson,
  memoryPerformanceLesson,
  // Learn — Async
  eventLoopLesson,
  callbacksLesson,
  promisesLesson,
  asyncAwaitLesson,
  concurrencyLesson,
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
  // Reference — Array
  arrayMapReference,
  arrayFilterReference,
  arrayReduceReference,
  arrayForEachReference,
  arrayFindReference,
  arraySomeEveryReference,
  arrayFlatReference,
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
  // Integrations
  restApisIntegration,
  telegramIntegration,
  youtubeIntegration,
  oauthIntegration,
  paymentsIntegration,
  authFlowsIntegration,
  realtimeIntegration,
  // Projects
  telegramBotProject,
  youtubeSearchProject,
  chatAppProject,
  adminDashboardProject,
  notesAppProject,
  analyticsDashboardProject,
  crudAppProject,
  // Explore
  librariesExplore,
  apisExplore,
  toolingExplore,
  glossaryExplore,
  comparisonsExplore,
  // Errors
  commonErrorsGuide,
  asyncErrorsGuide,
  domErrorsGuide,
  apiErrorsGuide,
  debuggingGuide,
];
