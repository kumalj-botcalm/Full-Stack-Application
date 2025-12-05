import { useMemo } from 'react';
import { useUsers } from '@/hooks/useUser';
import { useProducts } from '@/hooks/useProducts';

interface DashboardMetrics {
  totalProducts: number;
  totalUsers: number;
  averagePrice: number;
  totalCategories: number;
}

interface RecentActivity {
  id: number;
  type: 'user_added' | 'product_viewed';
  description: string;
  timestamp: string;
  user?: string;
}

interface CategoryData {
  category: string;
  count: number;
  totalValue: number;
}

interface PriceRangeData {
  range: string;
  count: number;
}

export function useDashboardData() {
  const { data: usersResponse, isLoading: usersLoading } = useUsers({
    page: 1,
    limit: 1000,
  });
  const { data: productsResponse, isLoading: productsLoading } = useProducts({
    page: 1,
    limit: 1000,
  });

  const isLoading = usersLoading || productsLoading;

  // Real metrics calculated from actual data
  const metrics = useMemo<DashboardMetrics>(() => {
    const safeUsers = usersResponse?.users || [];
    const safeProducts = productsResponse?.products || [];

    const totalProducts = safeProducts.length;
    const totalUsers = safeUsers.length;

    // Calculate real average price from products (no decimals)
    const averagePrice =
      safeProducts.length > 0
        ? Math.round(safeProducts.reduce(
            (sum: number, product: any) => sum + (product.price || 0),
            0
          ) / safeProducts.length)
        : 0;

    // Get unique categories count
    const categories = new Set(
      safeProducts.map((product: any) => product.category)
    );
    const totalCategories = categories.size;

    return {
      totalProducts,
      totalUsers,
      averagePrice,
      totalCategories,
    };
  }, [usersResponse, productsResponse]);

  // Category distribution data
  const categoryData = useMemo<CategoryData[]>(() => {
    const safeProducts = productsResponse?.products || [];
    const categoryMap = new Map<
      string,
      { count: number; totalValue: number }
    >();

    safeProducts.forEach((product: any) => {
      const category = product.category || 'Uncategorized';
      const price = product.price || 0;

      if (categoryMap.has(category)) {
        const existing = categoryMap.get(category)!;
        categoryMap.set(category, {
          count: existing.count + 1,
          totalValue: existing.totalValue + price,
        });
      } else {
        categoryMap.set(category, { count: 1, totalValue: price });
      }
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      count: data.count,
      totalValue: data.totalValue,
    }));
  }, [productsResponse]);

  // Price range distribution
  const priceRangeData = useMemo<PriceRangeData[]>(() => {
    const safeProducts = productsResponse?.products || [];

    return [
      {
        range: '$0-$100',
        count: safeProducts.filter(
          (product: any) => (product.price || 0) <= 100
        ).length,
      },
      {
        range: '$101-$500',
        count: safeProducts.filter(
          (product: any) =>
            (product.price || 0) > 100 && (product.price || 0) <= 500
        ).length,
      },
      {
        range: '$501-$1000',
        count: safeProducts.filter(
          (product: any) =>
            (product.price || 0) > 500 && (product.price || 0) <= 1000
        ).length,
      },
      {
        range: '$1000+',
        count: safeProducts.filter(
          (product: any) => (product.price || 0) > 1000
        ).length,
      },
    ];
  }, [productsResponse]);

  // Recent activity (mock data for demo)
  const recentActivity = useMemo<RecentActivity[]>(() => {
    const safeUsers = usersResponse?.users || [];
    const activities: RecentActivity[] = [];

    // Add some recent user activities
    safeUsers.slice(-5).forEach((user: any, index: number) => {
      activities.push({
        id: index + 1,
        type: 'user_added',
        description: `New user ${user.firstName} ${user.lastName} registered`,
        timestamp: new Date(
          Date.now() - index * 24 * 60 * 60 * 1000
        ).toISOString(),
        user: `${user.firstName} ${user.lastName}`,
      });
    });

    return activities.reverse();
  }, [usersResponse]);

  // Top products
  const topProducts = useMemo(() => {
    const safeProducts = productsResponse?.products || [];
    return [...safeProducts]
      .sort((a: any, b: any) => (b.price || 0) - (a.price || 0))
      .slice(0, 5);
  }, [productsResponse]);

  // User growth data (mock monthly data)
  const userGrowthData = useMemo(() => {
    const safeUsers = usersResponse?.users || [];
    const monthlyData = new Map<string, number>();

    safeUsers.forEach((user: any) => {
      if (user.createdAt) {
        const month = new Date(user.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        });
        monthlyData.set(month, (monthlyData.get(month) || 0) + 1);
      }
    });

    return Array.from(monthlyData.entries()).map(([month, users]) => ({
      month,
      users,
    }));
  }, [usersResponse]);

  // Gender distribution data
  const genderData = useMemo(() => {
    const safeUsers = usersResponse?.users || [];
    const genderMap = new Map<string, number>();

    safeUsers.forEach((user: any) => {
      const gender = user.gender || 'Not specified';
      genderMap.set(gender, (genderMap.get(gender) || 0) + 1);
    });

    return Array.from(genderMap.entries()).map(([gender, count]) => ({
      gender,
      count,
    }));
  }, [usersResponse]);

  return {
    metrics,
    categoryData,
    priceRangeData,
    recentActivity,
    topProducts,
    userGrowthData,
    genderData,
    isLoading,
  };
}
