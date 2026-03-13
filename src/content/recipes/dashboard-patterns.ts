import type { RecipeContent } from '@/types/content';

export const dashboardPatternsRecipe: RecipeContent = {
  id: 'dashboard-patterns',
  title: 'Dashboard Patterns',
  description: 'Build data dashboards with cards, charts, filters, and responsive layouts.',
  slug: 'recipes/dashboard-patterns',
  pillar: 'recipes',
  category: 'data-patterns',
  tags: ['dashboard', 'charts', 'layout', 'data'],
  difficulty: 'intermediate',
  contentType: 'recipe',
  summary: 'Design effective dashboards with KPI cards, data grids, filters, and responsive chart layouts.',
  relatedTopics: ['pagination', 'realtime-updates'],
  order: 10,
  updatedAt: '2024-03-01',
  readingTime: 14,
  featured: false,
  keywords: ['dashboard', 'KPI', 'chart', 'grid', 'metrics', 'analytics'],
  problem: 'Dashboards show complex data. You need them clear, filterable, and usable on any device.',
  pitfalls: [
    'Too many metrics crammed into one screen',
    'No loading skeletons (feels broken)',
    'Charts that break on mobile',
    'Missing date range filters',
    'Terrible mobile layout',
  ],
  variations: ['Admin dashboard', 'Analytics dashboard', 'Monitoring dashboard', 'Sales dashboard'],
  sections: [
    { type: 'heading', level: 2, text: 'KPI Card Component', id: 'kpi-card' },
    { type: 'code', language: 'tsx', filename: 'KpiCard.tsx', code: `interface KpiCardProps {\\n  title: string;\\n  value: string;\\n  change: number;\\n  changeLabel?: string;\\n  icon?: React.ReactNode;\\n  loading?: boolean;\\n}\\n\\nfunction KpiCard({ title, value, change, changeLabel, icon, loading }: KpiCardProps) {\\n  if (loading) {\\n    return (\\n      <div className="rounded-xl border bg-card p-6 animate-pulse">\\n        <div className="h-4 bg-muted rounded w-1/2 mb-3" />\\n        <div className="h-8 bg-muted rounded w-3/4" />\\n      </div>\\n    );\\n  }\\n\\n  const isPositive = change >= 0;\\n  return (\\n    <div className="rounded-xl border bg-card p-6">\\n      <div className="flex items-center justify-between mb-2">\\n        <span className="text-sm font-medium text-muted-foreground">{title}</span>\\n        <span className="text-2xl">{icon}</span>\\n      </div>\\n      <div className="text-3xl font-bold">{value}</div>\\n      <div className={'text-sm mt-2 ' + (isPositive ? 'text-green-600' : 'text-red-600')}>\\n        {isPositive ? '↑' : '↓'} {Math.abs(change)}% {changeLabel && ('(' + changeLabel + ')')}\\n      </div>\\n    </div>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Responsive Dashboard Grid', id: 'grid-layout' },
    { type: 'code', language: 'tsx', filename: 'DashboardGrid.tsx', code: `function DashboardGrid({ children }: { children: React.ReactNode }) {\\n  return (\\n    <div className="space-y-6">\\n      {/* KPI row: 2 cols on mobile, 4 on desktop */}\\n      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">\\n        {children}\\n      </div>\\n    </div>\\n  );\\n}\\n\\n// Chart grid: flexible column spans\\nfunction ChartGrid({ children }: { children: React.ReactNode }) {\\n  return (\\n    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">\\n      {children}\\n    </div>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Date Range Filter', id: 'date-range' },
    { type: 'code', language: 'typescript', filename: 'useDateRange.ts', code: `type DatePreset = '7d' | '30d' | '90d' | '12m' | 'custom';\\n\\ninterface DateRange {\\n  from: Date;\\n  to: Date;\\n  preset: DatePreset;\\n}\\n\\nfunction getDateRange(preset: DatePreset): DateRange {\\n  const to = new Date();\\n  const from = new Date();\\n\\n  switch (preset) {\\n    case '7d': from.setDate(to.getDate() - 7); break;\\n    case '30d': from.setDate(to.getDate() - 30); break;\\n    case '90d': from.setDate(to.getDate() - 90); break;\\n    case '12m': from.setFullYear(to.getFullYear() - 1); break;\\n    case 'custom': return { from, to, preset }; // let user choose\\n  }\\n\\n  return { from, to, preset };\\n}\\n\\nfunction useDateRange(initial: DatePreset = '30d') {\\n  const [preset, setPreset] = useState<DatePreset>(initial);\\n  const [customFrom, setCustomFrom] = useState<Date | null>(null);\\n  const [customTo, setCustomTo] = useState<Date | null>(null);\\n\\n  const range = preset === 'custom' && customFrom && customTo\\n    ? { from: customFrom, to: customTo, preset }\\n    : getDateRange(preset);\\n\\n  return { range, preset, setPreset, setCustomFrom, setCustomTo };\\n}` },

    { type: 'heading', level: 2, text: 'Chart Wrapper with Recharts', id: 'chart-wrapper' },
    { type: 'code', language: 'tsx', filename: 'ChartCard.tsx', code: `import {\\n  ResponsiveContainer, LineChart, Line,\\n  XAxis, YAxis, CartesianGrid, Tooltip\\n} from 'recharts';\\n\\ninterface ChartCardProps {\\n  title: string;\\n  data: { date: string; value: number }[];\\n  color?: string;\\n  loading?: boolean;\\n}\\n\\nfunction ChartCard({ title, data, color = 'hsl(var(--primary))', loading }: ChartCardProps) {\\n  return (\\n    <div className="rounded-xl border bg-card p-6">\\n      <h3 className="font-semibold mb-4">{title}</h3>\\n      {loading ? (\\n        <div className="h-64 bg-muted rounded animate-pulse" />\\n      ) : (\\n        <ResponsiveContainer width="100%" height={200}>\\n          <LineChart data={data}>\\n            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />\\n            <XAxis dataKey="date" className="text-xs" />\\n            <YAxis className="text-xs" />\\n            <Tooltip\\n              contentStyle={{\\n                backgroundColor: 'hsl(var(--card))',\\n                border: '1px solid hsl(var(--border))',\\n              }}\\n            />\\n            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} />\\n          </LineChart>\\n        </ResponsiveContainer>\\n      )}\\n    </div>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Data Table Pattern', id: 'data-table' },
    { type: 'code', language: 'tsx', filename: 'DataTable.tsx', code: `interface Column<T> {\\n  key: keyof T;\\n  header: string;\\n  render?: (value: T[keyof T], row: T) => React.ReactNode;\\n  sortable?: boolean;\\n}\\n\\nfunction DataTable<T extends { id: string }>({\\n  data, columns, loading\\n}: {\\n  data: T[];\\n  columns: Column<T>[];\\n  loading?: boolean;\\n}) {\\n  const [sortKey, setSortKey] = useState<keyof T | null>(null);\\n  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');\\n\\n  const sorted = sortKey\\n    ? [...data].sort((a, b) => {\\n        const aVal = a[sortKey];\\n        const bVal = b[sortKey];\\n        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;\\n        return sortDir === 'asc' ? cmp : -cmp;\\n      })\\n    : data;\\n\\n  const toggleSort = (key: keyof T) => {\\n    if (sortKey === key) {\\n      setSortDir(d => d === 'asc' ? 'desc' : 'asc');\\n    } else {\\n      setSortKey(key);\\n      setSortDir('asc');\\n    }\\n  };\\n\\n  if (loading) {\\n    return <div className="h-64 bg-muted rounded animate-pulse" />;\\n  }\\n\\n  return (\\n    <div className="rounded-xl border overflow-hidden">\\n      <table className="w-full text-sm">\\n        <thead className="bg-muted border-b">\\n          <tr>\\n            {columns.map(col => (\\n              <th key={String(col.key)} className="px-4 py-2 text-left font-medium">\\n                {col.sortable ? (\\n                  <button\\n                    onClick={() => toggleSort(col.key)}\\n                    className="hover:underline"\\n                  >\\n                    {col.header} {sortKey === col.key && (sortDir === 'asc' ? '↑' : '↓')}\\n                  </button>\\n                ) : (\\n                  col.header\\n                )}\\n              </th>\\n            ))}\\n          </tr>\\n        </thead>\\n        <tbody>\\n          {sorted.map(row => (\\n            <tr key={row.id} className="border-b hover:bg-muted/50">\\n              {columns.map(col => (\\n                <td key={String(col.key)} className="px-4 py-2">\\n                  {col.render ? col.render(row[col.key], row) : String(row[col.key])}\\n                </td>\\n              ))}\\n            </tr>\\n          ))}\\n        </tbody>\\n      </table>\\n    </div>\\n  );\\n}` },

    { type: 'heading', level: 2, text: 'Auto-Refresh Pattern', id: 'auto-refresh' },
    { type: 'code', language: 'typescript', filename: 'useAutoRefresh.ts', code: `function useAutoRefresh(callback: () => void, intervalMs = 30000) {\\n  const [isAuto, setIsAuto] = useState(true);\\n  const [lastRefresh, setLastRefresh] = useState(new Date());\\n\\n  useEffect(() => {\\n    if (!isAuto) return;\\n    const id = setInterval(() => {\\n      callback();\\n      setLastRefresh(new Date());\\n    }, intervalMs);\\n    return () => clearInterval(id);\\n  }, [isAuto, intervalMs, callback]);\\n\\n  return { isAuto, setIsAuto, lastRefresh };\\n}` },

    { type: 'heading', level: 2, text: 'Layout Best Practices', id: 'layout-tips' },
    { type: 'list', items: [
      'Place highest-priority metrics at top-left (that\'s where people\'s eyes go first)',
      'Use consistent card sizes — avoid mixing tiny and huge cards',
      'Group related metrics together (revenue cards near revenue charts)',
      'Provide global date range filter that affects all widgets',
      'Add loading skeletons that match the final layout exactly',
      'Support full-screen mode for individual charts',
      'Make charts responsive with ResponsiveContainer',
    ]},

    { type: 'callout', variant: 'tip', title: 'Mobile Dashboards', text: 'On mobile, stack cards vertically and use horizontal scrolling for data tables. Consider showing a simplified "top metrics" view with a button to expand full dashboard.' },
  ],
};
