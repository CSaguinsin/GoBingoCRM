// app/(crm-dashboard)/reports/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SidebarContent from '../../components/sidebar'
import RegistrationChart from '../../components/RegistrationChart'
import {
  DynamicChartContainer,
  DynamicChartTooltip,
  DynamicChartLegend,
  DynamicChartTooltipContent,
  DynamicBarChart as BarChart,
  DynamicXAxis as XAxis,
  DynamicYAxis as YAxis,
  DynamicBar as Bar,
  DynamicResponsiveContainer as ResponsiveContainer
} from '../../components/ChartWrapper.client'

const crmData = [
  { month: "Jan", leads: 120, opportunities: 80, closedDeals: 40 },
  { month: "Feb", leads: 140, opportunities: 90, closedDeals: 50 },
  { month: "Mar", leads: 160, opportunities: 100, closedDeals: 60 },
  { month: "Apr", leads: 180, opportunities: 110, closedDeals: 70 },
  { month: "May", leads: 200, opportunities: 120, closedDeals: 80 },
  { month: "Jun", leads: 220, opportunities: 130, closedDeals: 90 },
];

export default function CRMReportChart() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 bg-yellow-500 text-white p-4 flex-shrink-0">
        <SidebarContent />
      </div>
      
      <div className="flex-1 p-8 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Registration Timeline Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Registration Timeline</CardTitle>
              <CardDescription>Monthly user registration trends</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <RegistrationChart />
            </CardContent>
          </Card>

          {/* CRM Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>CRM Performance</CardTitle>
              <CardDescription>Lead conversion pipeline</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <DynamicChartContainer
                config={{
                  leads: { label: "Leads", color: "var(--color-leads)" },
                  opportunities: { label: "Opportunities", color: "var(--color-opportunities)" },
                  closedDeals: { label: "Closed Deals", color: "var(--color-closedDeals)" }
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={crmData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <DynamicChartTooltip content={<DynamicChartTooltipContent />} />
                    <DynamicChartLegend />
                    <Bar dataKey="leads" fill="var(--color-leads)" />
                    <Bar dataKey="opportunities" fill="var(--color-opportunities)" />
                    <Bar dataKey="closedDeals" fill="var(--color-closedDeals)" />
                  </BarChart>
                </ResponsiveContainer>
              </DynamicChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}