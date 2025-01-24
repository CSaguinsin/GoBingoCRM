// components/ChartWrapper.client.tsx
'use client';

import dynamic from 'next/dynamic';
import type { 
  TooltipProps, 
  LegendProps,
  BarChartProps,
  XAxisProps,
  YAxisProps,
  BarProps
} from 'recharts';
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { 
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartTooltipContent 
} from '@/components/ui/chart';

// Properly typed dynamic imports for custom components
export const DynamicChartContainer = dynamic(
  () => import('@/components/ui/chart').then(mod => mod.ChartContainer),
  { 
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse" />
  }
);

export const DynamicChartTooltip = dynamic<TooltipProps<any, any>>(
  () => import('@/components/ui/chart').then(mod => mod.ChartTooltip),
  { ssr: false }
);

export const DynamicChartLegend = dynamic<LegendProps>(
  () => import('@/components/ui/chart').then(mod => mod.ChartLegend),
  { ssr: false }
);

export const DynamicChartTooltipContent = dynamic(
  () => import('@/components/ui/chart').then(mod => mod.ChartTooltipContent),
  { ssr: false }
);

// Direct exports for Recharts components with proper types
export const DynamicBarChart = (props: BarChartProps) => <BarChart {...props} />;
export const DynamicXAxis = (props: XAxisProps) => <XAxis {...props} />;
export const DynamicYAxis = (props: YAxisProps) => <YAxis {...props} />;
export const DynamicBar = (props: BarProps) => <Bar {...props} />;
export const DynamicTooltip = (props: TooltipProps<any, any>) => <Tooltip {...props} />;
export const DynamicLegend = (props: LegendProps) => <Legend {...props} />;
export const DynamicResponsiveContainer = (props: any) => <ResponsiveContainer {...props} />;