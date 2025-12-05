import {
  ShoppingBagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  TagIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconBgColor: string;
  iconColor: string;
  description?: string;
  accentColor?: string;
}

function MetricCard({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
  description,
  accentColor,
}: MetricCardProps) {
  return (
    <Card
      className={`group bg-card/50 relative overflow-hidden border-2 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${accentColor || 'border-border'} hover:border-primary/30 hover:-translate-y-1`}
    >
      {/* Background Pattern */}
      <div className="from-background/5 to-accent/5 absolute inset-0 bg-linear-to-br via-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-70"></div>

      {/* Content */}
      <div className="relative">
        {/* Header with Icon */}
        <div className="mb-4 flex items-start justify-between">
          <div className="shrink-0">
            <div
              className={`relative rounded-2xl p-4 ${iconBgColor} border border-white/20 shadow-md transition-all duration-300 group-hover:shadow-lg dark:border-white/10`}
            >
              <Icon
                className={`h-8 w-8 ${iconColor} transition-transform duration-300 group-hover:scale-110`}
              />
              {/* Glow effect */}
              <div
                className={`absolute inset-0 rounded-2xl ${iconBgColor} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-50`}
              ></div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-2">
          <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
            {title}
          </h3>

          <div className="flex items-baseline space-x-2">
            <span className="from-foreground to-foreground/80 bg-linear-to-r bg-clip-text text-3xl font-bold text-transparent">
              {value}
            </span>
          </div>

          {description && (
            <p className="text-muted-foreground/80 text-xs font-medium">
              {description}
            </p>
          )}
        </div>

        {/* Bottom accent line */}
        <div className="via-primary/30 group-hover:via-primary/60 absolute right-0 bottom-0 left-0 h-1 bg-linear-to-r from-transparent to-transparent transition-all duration-300"></div>
      </div>
    </Card>
  );
}

function RecentActivity({ activities }: { activities: any[] }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_added':
        return (
          <UsersIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        );
      case 'product_viewed':
        return <EyeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <ShoppingBagIcon className="text-primary h-5 w-5" />;
    }
  };

  if (activities.length === 0) {
    return (
      <Card className="bg-card p-6 shadow-sm">
        <h3 className="text-foreground mb-4 text-lg font-medium">
          Recent Activity
        </h3>
        <div className="text-muted-foreground py-8 text-center">
          <UsersIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <p>No recent activity yet</p>
          <p className="text-sm">Add some users to see activity here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <h3 className="text-foreground mb-6 text-center text-2xl font-medium">
        Recent Activity
      </h3>
      <div className="scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent flow-root max-h-96 overflow-y-auto">
        <ul className="space-y-3">
          {activities.map((activity, index) => (
            <li key={activity.id} className="group relative">
              <div className="from-accent/5 to-accent/10 hover:from-accent/10 hover:to-accent/15 border-border/50 hover:border-primary/20 relative rounded-xl border bg-linear-to-r p-4 transition-all duration-300 hover:shadow-sm">
                {/* Connection line */}
                {index !== activities.length - 1 && (
                  <div className="from-primary/30 to-primary/10 absolute top-16 left-8 h-6 w-0.5 bg-linear-to-b"></div>
                )}

                <div className="flex items-start space-x-4">
                  {/* Icon container */}
                  <div className="relative shrink-0">
                    <div className="from-primary/20 to-primary/30 border-primary/20 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-linear-to-br shadow-sm transition-all duration-300 group-hover:shadow-md">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-center">
                      <div className="flex-1">
                        <p className="text-foreground group-hover:text-primary text-sm leading-relaxed font-medium transition-colors duration-200">
                          {activity.description}
                        </p>
                        {activity.user && (
                          <p className="text-muted-foreground mt-1 text-xs font-medium">
                            User:{' '}
                            <span className="text-primary/80">
                              {activity.user}
                            </span>
                          </p>
                        )}
                      </div>
                      <div className="ml-4 shrink-0"></div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Activity summary footer */}
      <div className="border-border mt-6 border-t pt-4">
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span className="flex items-center">
            <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
            {activities.length} recent{' '}
            {activities.length === 1 ? 'activity' : 'activities'}
          </span>
        </div>
      </div>
    </Card>
  );
}

// Enhanced color palettes for different chart types
const BAR_CHART_COLORS = [
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#0891B2', // Sky blue
  '#1E40AF', // Blue-700
  '#4C1D95', // Violet-800
  '#0E7490', // Cyan-700
];

const PIE_CHART_COLORS = [
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#10B981', // Emerald
  '#F97316', // Orange
  '#EC4899', // Pink
  '#84CC16', // Lime
  '#F43F5E', // Rose
  '#6366F1', // Indigo
];

// Bar Chart Configuration (Cool Blue Tones)
const categoryChartConfig = {} satisfies ChartConfig;

// Gender Pie Chart Configuration (Vibrant Tones)
const genderChartConfig = {
  count: {
    label: 'Users',
    color: '#EC4899', // Pink
  },
  Male: {
    label: 'Male',
    color: '#6366F1', // Indigo
  },
  Female: {
    label: 'Female',
    color: '#EC4899', // Pink
  },
  Other: {
    label: 'Other',
    color: '#F43F5E', // Rose
  },
} satisfies ChartConfig;

export default function DashboardHome() {
  const { user } = useAuthContext();
  const {
    metrics,
    recentActivity,
    categoryData,
    topProducts,
    genderData,
    isLoading,
  } = useDashboardData();

  const isSeller = user?.role === 'seller';

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const metricsCards = [
    {
      title: 'Total Products',
      value: metrics.totalProducts,
      icon: ShoppingBagIcon,
      iconBgColor:
        'bg-linear-to-br from-purple-500/10 via-purple-400/10 to-blue-500/10 dark:from-purple-400/20 dark:via-purple-300/15 dark:to-blue-400/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      description: 'Products in catalog',
      accentColor: 'border-purple-200 dark:border-purple-400/30',

      trendColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Total Users',
      value: metrics.totalUsers,
      icon: UsersIcon,
      iconBgColor:
        'bg-linear-to-br from-blue-500/10 via-blue-400/10 to-indigo-500/10 dark:from-blue-400/20 dark:via-blue-300/15 dark:to-indigo-400/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      description: 'Registered users',
      accentColor: 'border-blue-200 dark:border-blue-400/30',

      trendColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Average Price',
      value: `LKR ${metrics.averagePrice}`,
      icon: CurrencyDollarIcon,
      iconBgColor:
        'bg-linear-to-br from-emerald-500/10 via-emerald-400/10 to-teal-500/10 dark:from-emerald-400/20 dark:via-emerald-300/15 dark:to-teal-400/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      description: 'Per product',
      accentColor: 'border-emerald-200 dark:border-emerald-400/30',

      trendColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Categories',
      value: metrics.totalCategories,
      icon: TagIcon,
      iconBgColor:
        'bg-linear-to-br from-pink-500/10 via-pink-400/10 to-rose-500/10 dark:from-pink-400/20 dark:via-pink-300/15 dark:to-rose-400/20',
      iconColor: 'text-pink-600 dark:text-pink-400',
      description: 'Product categories',
      accentColor: 'border-pink-200 dark:border-pink-400/30',

      trendColor: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <div className="bg-background  space-y-8 p-6 transition-colors">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metricsCards
          .filter((metric) => isSeller || metric.title !== 'Total Users')
          .map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:gap-8">
        {/* Category Distribution Chart */}
        <Card className="bg-card border-border border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
          <h3 className="text-foreground mb-15 text-center text-2xl font-medium">
            Products by Category
          </h3>
          {categoryData.length > 0 ? (
            <ChartContainer config={categoryChartConfig} className="h-84">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  tickLine={true}
                  tickMargin={10}
                  axisLine={true}
                />
                <YAxis tickLine={true} tickMargin={10} axisLine={true} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={4}>
                  {categoryData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={BAR_CHART_COLORS[index % BAR_CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="text-muted-foreground flex h-64 items-center justify-center">
              <div className="text-center">
                <ShoppingBagIcon className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
                <p>No product data available</p>
              </div>
            </div>
          )}
        </Card>

        {/* Data Tables and Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-1 xl:gap-8">
          {/* Top Products */}
          <Card className="bg-card border-border border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <h3 className="from-accent-foreground to-accent-foreground/80 mb-6 bg-linear-to-r bg-clip-text text-center text-2xl font-semibold text-transparent">
              Top Products by Price
            </h3>
            {topProducts.length > 0 ? (
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="bg-accent/10 hover:bg-accent/20 border-border flex items-center justify-between rounded-xl border p-4 transition-all duration-200 hover:shadow-sm"
                  >
                    <div className="flex-1">
                      <div className="text-foreground truncate font-medium">
                        {product.name}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {product.category}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-foreground font-medium">
                        LKR {product.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground py-8 text-center">
                <ShoppingBagIcon className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
                <p>No products available</p>
              </div>
            )}
          </Card>
        </div>

        {/* User Gender Distribution - Only for Sellers */}
        {isSeller && (
          <Card className="bg-card border-border border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <h3 className="from-secondary-foreground to-secondary-foreground/80 mb-6 bg-linear-to-r bg-clip-text text-center text-2xl font-semibold text-transparent">
              Users by Gender
            </h3>
            {genderData.length > 0 ? (
              <ChartContainer config={genderChartConfig} className="h-126">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ gender, percent }) =>
                      `${gender} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={200}
                    dataKey="count"
                    nameKey="gender"
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {genderData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="text-muted-foreground py-8 text-center">
                <UsersIcon className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
                <p>No users registered yet</p>
              </div>
            )}
          </Card>
        )}

        {/* Recent Activity - Only for Sellers */}
        {isSeller && <RecentActivity activities={recentActivity} />}
      </div>
    </div>
  );
}
