// components/RegistrationChart.tsx
'use client';

import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
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
} from './ChartWrapper.client'

export default function RegistrationChart() {
  const [chartData, setChartData] = useState<Array<{ month: string; registrations: number }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('user_registration')
          .select('created_at')
          .order('created_at', { ascending: true })

        if (error) throw error

        const monthlyData = data.reduce((acc: Record<string, number>, entry) => {
          try {
            // Fix timestamp format and parse date
            const isoString = entry.created_at.replace(/\+0t$/, '+00')
            const date = new Date(isoString)
            
            // Validate date
            if (isNaN(date.getTime())) {
              throw new Error(`Invalid date: ${entry.created_at}`)
            }

            const month = date.toLocaleString('default', { month: 'short' })
            acc[month] = (acc[month] || 0) + 1

          } catch (parseError) {
            console.error('Error parsing date:', parseError)
          }
          return acc
        }, {})

        setChartData(Object.entries(monthlyData).map(([month, count]) => ({
          month,
          registrations: count
        })))

      } catch (err) {
        console.error('Error fetching registration data:', err)
        setError('Failed to load registration data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="h-[400px] w-full">
      {loading && <div className="h-full flex items-center justify-center">Loading chart...</div>}
      {error && <div className="h-full flex items-center justify-center text-red-500">{error}</div>}
      
      {!loading && !error && (
        <DynamicChartContainer
          config={{
            registrations: { 
              label: "Registrations", 
              color: "var(--color-registrations)" 
            }
          }}
          className="h-full w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <DynamicChartTooltip content={<DynamicChartTooltipContent />} />
              <DynamicChartLegend />
              <Bar 
                dataKey="registrations" 
                fill="var(--color-registrations)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </DynamicChartContainer>
      )}
    </div>
  )
}