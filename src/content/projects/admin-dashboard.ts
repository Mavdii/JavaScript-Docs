import type { ProjectContent } from '@/types/content';

export const adminDashboardProject: ProjectContent = {
  id: 'project-admin-dashboard',
  title: 'Admin Dashboard',
  description: 'Build a full-featured admin dashboard with data tables, charts, and user management.',
  slug: 'projects/admin-dashboard',
  pillar: 'projects',
  category: 'applications',
  tags: ['dashboard', 'admin', 'charts', 'tables'],
  difficulty: 'advanced',
  contentType: 'project',
  summary: 'Build a professional admin dashboard with responsive sidebar, data tables (sortable, filterable), charts, KPI cards, and role-based access control. A real-world project showcasing advanced React patterns.',
  relatedTopics: ['dashboard-patterns', 'project-analytics-dashboard'],
  order: 4,
  updatedAt: '2025-06-01',
  readingTime: 35,
  featured: false,
  keywords: ['admin dashboard', 'data tables', 'charts', 'CRUD'],
  techStack: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS', 'TanStack Table'],
  learningGoals: ['Build responsive dashboard layouts', 'Implement data tables with sorting and filtering', 'Create interactive charts', 'Add role-based access control UI'],
  features: ['Responsive sidebar navigation', 'Data tables with CRUD', 'Chart widgets', 'User management', 'Dark mode'],
  sections: [
    { type: 'heading', level: 2, text: 'Dashboard Layout Architecture', id: 'layout' },
    { type: 'paragraph', text: 'A dashboard is all about layout. You\'ve got a sidebar for navigation, a main content area with responsive grids, and a top bar for user controls. Let\'s build this so it works on mobile, tablet, and desktop without feeling cramped.' },
    { type: 'code', language: 'tsx', code: `function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={\`
        \${sidebarOpen ? 'w-64' : 'w-16'} 
        \${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        transition-all duration-300 border-r bg-card flex flex-col
        \${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'relative'}
      \`}>
        <div className="p-4 border-b flex items-center justify-between">
          {sidebarOpen && <span className="font-bold text-lg">Admin</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-muted">
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" href="/admin" collapsed={!sidebarOpen} />
          <NavItem icon={Users} label="Users" href="/admin/users" collapsed={!sidebarOpen} />
          <NavItem icon={Package} label="Products" href="/admin/products" collapsed={!sidebarOpen} />
          <NavItem icon={BarChart3} label="Analytics" href="/admin/analytics" collapsed={!sidebarOpen} />
          <NavItem icon={Settings} label="Settings" href="/admin/settings" collapsed={!sidebarOpen} />
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="border-b px-6 py-3 flex items-center justify-between">
          {isMobile && (
            <button onClick={() => setSidebarOpen(true)} className="p-2">☰</button>
          )}
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}` },

    { type: 'heading', level: 2, text: 'KPI Stats Cards', id: 'stats-cards' },
    { type: 'paragraph', text: 'KPI cards show the big numbers at a glance. Total users, revenue, orders, bounce rate. Each card has a trend indicator so you can tell if things are improving or getting worse.' },
    { type: 'code', language: 'tsx', code: `interface StatCardProps {
  label: string;
  value: string;
  change: number; // percentage
  icon: React.ElementType;
  trend: 'up' | 'down' | 'neutral';
}

function StatCard({ label, value, change, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <div className="flex items-center gap-1 mt-1">
        <span className={\`text-xs font-medium \${
          trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
        }\`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {Math.abs(change)}%
        </span>
        <span className="text-xs text-muted-foreground">vs last month</span>
      </div>
    </div>
  );
}

function StatsGrid() {
  const stats: StatCardProps[] = [
    { label: 'Total Users', value: '2,847', change: 12, icon: Users, trend: 'up' },
    { label: 'Revenue', value: '\$48,290', change: 8.2, icon: DollarSign, trend: 'up' },
    { label: 'Orders', value: '1,234', change: 23, icon: ShoppingCart, trend: 'up' },
    { label: 'Bounce Rate', value: '32.4%', change: -3.1, icon: TrendingDown, trend: 'down' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(stat => <StatCard key={stat.label} {...stat} />)}
    </div>
  );
}` },

    { type: 'heading', level: 2, text: 'Data Table with TanStack Table', id: 'data-table' },
    { type: 'paragraph', text: 'Data tables are powerful when you can sort and filter. TanStack Table handles the logic — you just provide data and column definitions. It\'s headless, so you control the rendering completely.' },
    { type: 'code', language: 'tsx', code: `import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'editor';
  status: 'active' | 'inactive';
  joinedAt: string;
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
          {row.original.name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-sm">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ getValue }) => (
      <span className="rounded-full px-2 py-1 text-xs font-medium bg-muted">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const active = getValue<string>() === 'active';
      return (
        <span className={\`inline-flex items-center gap-1 text-xs \${active ? 'text-green-600' : 'text-muted-foreground'}\`}>
          <span className={\`h-1.5 w-1.5 rounded-full \${active ? 'bg-green-500' : 'bg-gray-400'}\`} />
          {getValue<string>()}
        </span>
      );
    },
  },
  {
    accessorKey: 'joinedAt',
    header: 'Joined',
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
  },
];

function UsersTable({ data }: { data: User[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-4">
      <input
        value={globalFilter}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Search users..."
        className="rounded-md border px-3 py-2 text-sm w-full max-w-sm"
      />

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="text-left p-3 font-medium cursor-pointer select-none hover:bg-muted"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: ' ↑', desc: ' ↓' }[header.column.getIsSorted() as string] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-t hover:bg-muted/30">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <div className="flex gap-2">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Previous</button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}` },

    { type: 'heading', level: 2, text: 'Chart Widgets', id: 'charts' },
    { type: 'paragraph', text: 'Charts make data visual. Use Recharts to build responsive, interactive charts. Always wrap in ResponsiveContainer so they resize properly on different screens.' },
    { type: 'code', language: 'tsx', code: `import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

function RevenueChart({ data }: { data: { month: string; revenue: number; target: number }[] }) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="font-semibold mb-4">Revenue vs Target</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="month" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip
            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
          />
          <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function CategoryBreakdown({ data }: { data: { name: string; value: number }[] }) {
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="font-semibold mb-4">Sales by Category</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}` },

    { type: 'heading', level: 2, text: 'Activity Feed', id: 'activity-feed' },
    { type: 'code', language: 'tsx', code: `interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'login';
}

function ActivityFeed({ activities }: { activities: Activity[] }) {
  const typeIcons: Record<Activity['type'], string> = {
    create: '➕', update: '✏️', delete: '🗑️', login: '🔐',
  };

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map(activity => (
          <div key={activity.id} className="flex gap-3 items-start">
            <span className="text-lg">{typeIcons[activity.type]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>{' '}
                {activity.action}{' '}
                <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatRelativeTime(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return \`\${minutes}m ago\`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return \`\${hours}h ago\`;
  return \`\${Math.floor(hours / 24)}d ago\`;
}` },

    { type: 'heading', level: 2, text: 'Best Practices', id: 'best-practices' },
    { type: 'list', items: [
      'Use skeleton loading states for every data section to avoid layout shift',
      'Implement client-side role checks for UX only — enforce on server',
      'Use TanStack Table for sortable/filterable tables with server-side pagination',
      'Keep sidebar state in localStorage for persistence across sessions',
      'Use Recharts ResponsiveContainer for all charts to handle resize',
      'Implement dark mode from the start — use CSS variables for all colors',
      'Add keyboard shortcuts for power users (/, ⌘K for search)',
    ] },
  ],
};
