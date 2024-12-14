import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useOrder } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Package,
  ArrowUp,
  ArrowDown,
  Settings,
  Calendar
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';

const MOCK_SALES_DATA = [
  { date: 'Lun', sales: 120000 },
  { date: 'Mar', sales: 150000 },
  { date: 'Mer', sales: 180000 },
  { date: 'Jeu', sales: 160000 },
  { date: 'Ven', sales: 200000 },
  { date: 'Sam', sales: 250000 },
  { date: 'Dim', sales: 220000 }
];

const MOCK_PRODUCTS_DATA = [
  { name: "J'adore", sales: 45 },
  { name: 'N°5', sales: 38 },
  { name: 'La Vie Est Belle', sales: 32 },
  { name: 'Sauvage', sales: 28 },
  { name: 'Good Girl', sales: 25 }
];

export default function Dashboard() {
  const { products } = useAdmin();
  const { orders } = useOrder();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    conversionRate: 0
  });

  useEffect(() => {
    // Calculate stats
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const conversionRate = totalOrders > 0 ? ((totalOrders / 100) * 100).toFixed(1) : 0;

    setStats({
      totalProducts,
      totalOrders,
      totalSales,
      conversionRate: Number(conversionRate)
    });
  }, [products, orders]);

  const statsCards = [
    {
      title: 'Produits actifs',
      value: stats.totalProducts.toString(),
      icon: Package,
      change: '+5%',
      trend: 'up' as const
    },
    {
      title: 'Commandes',
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      change: '+2',
      trend: 'up' as const
    },
    {
      title: 'Ventes du jour',
      value: `${stats.totalSales.toLocaleString()} FCFA`,
      icon: DollarSign,
      change: '+15%',
      trend: 'up' as const
    },
    {
      title: 'Taux de conversion',
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
      change: '+0.5%',
      trend: 'up' as const
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Aperçu de vos performances commerciales
          </p>
        </div>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Paramètres
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUp : ArrowDown;
          const trendColor = stat.trend === 'up' ? 'text-green-600' : 'text-red-600';

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Icon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1">
                  <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                  <span className={`text-sm ${trendColor}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    vs hier
                  </span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Évolution des ventes</h2>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Cette semaine
              </Button>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_SALES_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#888888" />
                  <YAxis 
                    stroke="#888888"
                    tickFormatter={(value) => `${(value / 1000)}k`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`${value.toLocaleString()} FCFA`, 'Ventes']}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    dot={{ fill: '#7c3aed' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Meilleures ventes</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_PRODUCTS_DATA} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#888888" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#888888"
                    width={100}
                  />
                  <Tooltip />
                  <Bar 
                    dataKey="sales" 
                    fill="#7c3aed"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}