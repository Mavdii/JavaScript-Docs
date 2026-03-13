import type { ProjectContent } from '@/types/content';

export const analyticsDashboardProject: ProjectContent = {
  id: 'project-analytics-dashboard',
  title: 'Analytics Dashboard',
  description: 'Build an analytics dashboard with interactive charts and data filtering.',
  slug: 'projects/analytics-dashboard',
  pillar: 'projects',
  category: 'applications',
  tags: ['analytics', 'charts', 'dashboard', 'Recharts'],
  difficulty: 'intermediate',
  contentType: 'project',
  summary: 'Build a data-rich analytics dashboard with Recharts. Learn to visualize time-series data, compare metrics, filter by date range, and export data to CSV.',
  relatedTopics: ['project-admin-dashboard', 'dashboard-patterns'],
  order: 6,
  updatedAt: '2025-06-01',
  readingTime: 22,
  featured: false,
  keywords: ['analytics', 'dashboard', 'Recharts', 'data visualization'],
  techStack: ['React', 'TypeScript', 'Recharts', 'date-fns', 'Tailwind CSS'],
  learningGoals: ['Build chart components with Recharts', 'Implement date range filtering', 'Create responsive dashboard grids', 'Handle data aggregation'],
  features: ['Line, bar, and pie charts', 'Date range picker', 'Responsive grid layout', 'Data export'],
  sections: [
    { type: 'heading', level: 2, text: 'Data Structure & Aggregation', id: 'data-structure' },
    { type: 'paragraph', text: 'Analytics is all about aggregating raw data into metrics. We\'ll fetch daily stats, calculate totals, compute trends, and compare against previous periods.' },
    { type: 'code', language: 'typescript', code: `interface AnalyticsData {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number; // seconds
  conversions: number;
}

interface MetricSummary {
  current: number;
  previous: number;
  change: number; // percentage
  trend: 'up' | 'down' | 'neutral';
}

function aggregateMetrics(data: AnalyticsData[], previousData: AnalyticsData[]): Record<string, MetricSummary> {
  const sum = (arr: AnalyticsData[], key: keyof AnalyticsData) =>
    arr.reduce((acc, d) => acc + (d[key] as number), 0);
  const avg = (arr: AnalyticsData[], key: keyof AnalyticsData) =>
    arr.length ? sum(arr, key) / arr.length : 0;

  function metric(current: number, previous: number): MetricSummary {
    const change = previous ? ((current - previous) / previous) * 100 : 0;
    return { current, previous, change, trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral' };
  }

  return {
    pageViews: metric(sum(data, 'pageViews'), sum(previousData, 'pageViews')),
    uniqueVisitors: metric(sum(data, 'uniqueVisitors'), sum(previousData, 'uniqueVisitors')),
    bounceRate: metric(avg(data, 'bounceRate'), avg(previousData, 'bounceRate')),
    conversions: metric(sum(data, 'conversions'), sum(previousData, 'conversions')),
  };
}` },

    { type: 'heading', level: 2, text: 'Date Range Picker', id: 'date-range' },
    { type: 'paragraph', text: 'Users want quick access to common date ranges (last 7, 30, 90 days) but also the option to pick custom dates. Build a picker that handles both.' },
    { type: 'code', language: 'tsx', code: `type DatePreset = '7d' | '30d' | '90d' | 'custom';

function DateRangePicker({ value, onChange }: {
  value: { from: Date; to: Date; preset: DatePreset };
  onChange: (range: { from: Date; to: Date; preset: DatePreset }) => void;
}) {
  const presets: { label: string; value: DatePreset; days: number }[] = [
    { label: 'Last 7 days', value: '7d', days: 7 },
    { label: 'Last 30 days', value: '30d', days: 30 },
    { label: 'Last 90 days', value: '90d', days: 90 },
  ];

  function selectPreset(preset: DatePreset, days: number) {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    onChange({ from, to, preset });
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {presets.map(p => (
        <button
          key={p.value}
          onClick={() => selectPreset(p.value, p.days)}
          className={\`px-3 py-1.5 text-sm rounded-md transition-colors \${
            value.preset === p.value ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }\`}
        >
          {p.label}
        </button>
      ))}
      <div className="flex items-center gap-1 text-sm">
        <input
          type="date"
          value={value.from.toISOString().split('T')[0]}
          onChange={e => onChange({ ...value, from: new Date(e.target.value), preset: 'custom' })}
          className="rounded border px-2 py-1 text-sm"
        />
        <span className="text-muted-foreground">—</span>
        <input
          type="date"
          value={value.to.toISOString().split('T')[0]}
          onChange={e => onChange({ ...value, to: new Date(e.target.value), preset: 'custom' })}
          className="rounded border px-2 py-1 text-sm"
        />
      </div>
    </div>
  );
}` },

    { type: 'heading', level: 2, text: 'Traffic Overview Chart', id: 'traffic-chart' },
    { type: 'paragraph', text: 'Show traffic trends with an area chart. Add a toggle to switch between page views and unique visitors. Recharts handles responsiveness for you.' },
    { type: 'code', language: 'tsx', code: `import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from 'recharts';

function TrafficChart({ data }: { data: AnalyticsData[] }) {
  const [activeMetric, setActiveMetric] = useState<'pageViews' | 'uniqueVisitors'>('pageViews');

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Traffic Overview</h3>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {(['pageViews', 'uniqueVisitors'] as const).map(metric => (
            <button
              key={metric}
              onClick={() => setActiveMetric(metric)}
              className={\`px-3 py-1 text-xs rounded-md transition-colors \${
                activeMetric === metric ? 'bg-background shadow-sm' : ''
              }\`}
            >
              {metric === 'pageViews' ? 'Page Views' : 'Visitors'}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="date"
            tickFormatter={d => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            className="text-xs"
          />
          <YAxis className="text-xs" tickFormatter={v => v >= 1000 ? \`\${(v/1000).toFixed(1)}k\` : v} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            labelFormatter={d => new Date(d).toLocaleDateString()}
          />
          <Area
            type="monotone"
            dataKey={activeMetric}
            stroke="hsl(var(--primary))"
            fill="url(#gradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}` },

    { type: 'heading', level: 2, text: 'Comparison Bar Chart', id: 'bar-chart' },
    { type: 'code', language: 'tsx', code: `import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function ConversionChart({ data }: {
  data: { source: string; visitors: number; conversions: number }[]
}) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="font-semibold mb-4">Conversions by Source</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="source" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="visitors" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="conversions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}` },

    { type: 'heading', level: 2, text: 'Data Export', id: 'export' },
    { type: 'paragraph', text: 'Let users download their analytics data as CSV. This is super useful for reports and further analysis.' },
    { type: 'code', language: 'typescript', code: `function exportToCSV(data: AnalyticsData[], filename: string): void {
  const headers = ['Date', 'Page Views', 'Unique Visitors', 'Bounce Rate', 'Avg Session', 'Conversions'];
  const rows = data.map(d => [
    d.date,
    d.pageViews,
    d.uniqueVisitors,
    \`\${d.bounceRate.toFixed(1)}%\`,
    formatDuration(d.avgSessionDuration),
    d.conversions,
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => \`"\${cell}"\`).join(',')),
  ].join('\\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = \`\${filename}-\${new Date().toISOString().split('T')[0]}.csv\`;
  link.click();
  URL.revokeObjectURL(url);
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return \`\${m}m \${s}s\`;
}` },

    { type: 'heading', level: 2, text: 'Dashboard Composition', id: 'composition' },
    { type: 'paragraph', text: 'Tie it all together. Create one main component that orchestrates the date range, fetches data, and renders all the sub-components.' },
    { type: 'code', language: 'tsx', code: `function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
    preset: '30d' as DatePreset,
  });

  const { data, isLoading } = useAnalyticsData(dateRange);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex gap-2">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <button
            onClick={() => data && exportToCSV(data.daily, 'analytics')}
            className="px-3 py-1.5 text-sm border rounded-md hover:bg-muted"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Page Views" metric={data.metrics.pageViews} format="number" />
        <MetricCard label="Visitors" metric={data.metrics.uniqueVisitors} format="number" />
        <MetricCard label="Bounce Rate" metric={data.metrics.bounceRate} format="percent" />
        <MetricCard label="Conversions" metric={data.metrics.conversions} format="number" />
      </div>

      {/* Charts */}
      <TrafficChart data={data.daily} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConversionChart data={data.sources} />
        <TopPagesTable data={data.topPages} />
      </div>
    </div>
  );
}` },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    { type: 'list', items: [
      'Always use ResponsiveContainer to make charts resize properly',
      'Format large numbers (1.2K, 3.4M) for readability',
      'Use gradients on area charts for visual appeal',
      'Add loading skeletons that match the chart layout to prevent layout shift',
      'Implement date range comparison (vs previous period) for context',
      'Export functionality adds professional value — support CSV and JSON',
      'Use CSS variables from the design system for chart colors',
    ] },
  ],
};
