import fs from 'node:fs/promises';
import path from 'node:path';
import { Buffer } from 'node:buffer';
import ts from 'typescript';

const rootDir = process.cwd();
const contentDir = path.join(rootDir, 'src', 'content');
const generatedDir = path.join(contentDir, 'generated');
const metadataOutPath = path.join(generatedDir, 'metadata.ts');
const loadersOutPath = path.join(generatedDir, 'loaders.ts');

const relatedTopicAliases = new Map(
  Object.entries({
    'array-map': 'array-map',
    performance: 'memory-performance',
    debugging: 'error-debugging',
    oop: 'prototypes',
    classes: 'prototypes',
    composition: 'functional-patterns',
    'memory-leaks': 'memory-leaks',
    'garbage-collection': 'garbage-collection',
    'performance-optimization': 'memory-performance',
    properties: 'object-keys',
    descriptors: 'object-freeze',
    'fetch-api': 'fetch',
    'event-listeners': 'events',
    'offline-storage': 'indexeddb',
    'service-workers': 'service-workers',
    'mouse-events': 'events',
    'touch-events': 'pointer-events',
    security: 'security',
    iteration: 'generators',
    iterables: 'generators',
    'data-types': 'variables',
    namespacing: 'modules-esm-cjs',
    'file-structure': 'modules-esm-cjs',
    'equality-operators': 'type-coercion',
    'type-checking': 'type-coercion',
    localStorage: 'local-storage',
    'media-queries': 'dark-mode',
    'css-variables': 'dark-mode',
    'dom-manipulation': 'dom',
    'event-emitter': 'realtime',
    images: 'image-lazy-loading',
    'event-handling': 'events',
    'loading-states': 'skeleton-loaders',
    'css-animations': 'skeleton-loaders',
    scrolling: 'infinite-scroll',
    'array-methods': 'array-map',
    buffer: 'typed-arrays',
    blob: 'file-apis',
    temporal: 'temporal',
    intl: 'intl',
    math: 'math-deep-dive',
    'bitwise-operations': 'typed-arrays',
    'string-methods': 'string-replace',
    'integration-websockets': 'websockets',
    'web-workers': 'web-workers',
  }).map(([from, to]) => [normalizeLookupKey(from), to])
);

function isContentEntry(value) {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.contentType === 'string' &&
    typeof value.title === 'string'
  );
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'generated') return [];
        return walk(fullPath);
      }
      if (!entry.isFile()) return [];
      if (!entry.name.endsWith('.ts')) return [];
      if (entry.name === 'registry.ts') return [];
      return [fullPath];
    })
  );

  return files.flat();
}

function toModuleUrl(source, filePath) {
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
    },
    fileName: filePath,
  }).outputText;

  return `data:text/javascript;base64,${Buffer.from(output).toString('base64')}`;
}

function createSummary(entry) {
  return {
    id: entry.id,
    title: entry.title,
    description: entry.description,
    slug: entry.slug,
    pillar: entry.pillar,
    category: entry.category,
    subcategory: entry.subcategory,
    tags: Array.isArray(entry.tags) ? entry.tags : [],
    difficulty: entry.difficulty,
    contentType: entry.contentType,
    summary: entry.summary,
    relatedTopics: Array.isArray(entry.relatedTopics) ? entry.relatedTopics : [],
    order: entry.order,
    updatedAt: entry.updatedAt,
    readingTime: entry.readingTime,
    featured: Boolean(entry.featured),
    keywords: Array.isArray(entry.keywords) ? entry.keywords : [],
    aliases: Array.isArray(entry.aliases) ? entry.aliases : [],
  };
}

function ensureSingleContentExport(filePath, exports) {
  const contentExports = exports.filter(([, value]) => isContentEntry(value));
  if (contentExports.length !== 1) {
    throw new Error(
      `Expected exactly one content export in ${path.relative(rootDir, filePath)}, found ${contentExports.length}`
    );
  }
  return contentExports[0];
}

function formatImportPath(filePath) {
  const relativePath = path.relative(generatedDir, filePath).replace(/\\/g, '/').replace(/\.ts$/, '');
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

function normalizeLookupKey(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function createLookup(records) {
  const candidates = new Map();

  const addCandidate = (key, id) => {
    const normalized = normalizeLookupKey(key);
    if (!normalized) return;
    if (!candidates.has(normalized)) {
      candidates.set(normalized, new Set());
    }
    candidates.get(normalized).add(id);
  };

  for (const record of records) {
    const { summary } = record;
    const segments = summary.slug.split('/');
    addCandidate(summary.id, summary.id);
    addCandidate(summary.slug, summary.id);
    addCandidate(summary.slug.replace(/\//g, '-'), summary.id);
    addCandidate(segments.at(-1), summary.id);
    if (segments.length >= 2) {
      addCandidate(segments.slice(-2).join('-'), summary.id);
    }
    for (const alias of summary.aliases) {
      addCandidate(alias, summary.id);
    }
  }

  const lookup = new Map();
  for (const [key, ids] of candidates) {
    if (ids.size === 1) {
      lookup.set(key, [...ids][0]);
    }
  }

  return lookup;
}

function normalizeRelatedTopics(records) {
  const lookup = createLookup(records);

  const resolveTopic = (topic) => {
    const normalized = normalizeLookupKey(topic);
    if (!normalized) return undefined;

    const direct = lookup.get(normalized);
    if (direct) return direct;

    const aliased = relatedTopicAliases.get(normalized);
    if (!aliased) return undefined;

    return lookup.get(normalizeLookupKey(aliased));
  };

  for (const record of records) {
    const resolved = record.summary.relatedTopics
      .map(resolveTopic)
      .filter((topicId) => Boolean(topicId) && topicId !== record.summary.id);

    record.summary.relatedTopics = [...new Set(resolved)];
  }
}

async function main() {
  await fs.mkdir(generatedDir, { recursive: true });

  const files = (await walk(contentDir)).sort();
  const records = [];

  for (const filePath of files) {
    try {
      const source = await fs.readFile(filePath, 'utf8');
      const moduleUrl = toModuleUrl(source, filePath);
      const moduleExports = Object.entries(await import(moduleUrl));
      const [exportName, entry] = ensureSingleContentExport(filePath, moduleExports);
      const summary = createSummary(entry);

      records.push({
        summary,
        exportName,
        importPath: formatImportPath(filePath),
      });
    } catch (error) {
      console.error(`Error processing file: ${filePath}`);
      console.error(error.message);
      throw error;
    }
  }

  records.sort((a, b) => a.summary.slug.localeCompare(b.summary.slug));
  normalizeRelatedTopics(records);

  const metadataSource = `// This file is auto-generated by scripts/generate-content.mjs.
// Do not edit manually.

import type { ContentSummary } from '@/types/content';

export const contentSummaries: ContentSummary[] = ${JSON.stringify(
    records.map((record) => record.summary),
    null,
    2
  )} as ContentSummary[];
`;

  const loaderEntries = records
    .map(
      (record) =>
        `  ${JSON.stringify(record.summary.slug)}: () => import(${JSON.stringify(record.importPath)}).then((module) => module.${record.exportName} as ContentEntry),`
    )
    .join('\n');

  const loadersSource = `// This file is auto-generated by scripts/generate-content.mjs.
// Do not edit manually.

import type { ContentEntry } from '@/types/content';

export type ContentLoader = () => Promise<ContentEntry>;

export const contentLoaders: Record<string, ContentLoader> = {
${loaderEntries}
};
`;

  await fs.writeFile(metadataOutPath, metadataSource);
  await fs.writeFile(loadersOutPath, loadersSource);

  console.log(`Generated content metadata and loaders for ${records.length} entries.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
