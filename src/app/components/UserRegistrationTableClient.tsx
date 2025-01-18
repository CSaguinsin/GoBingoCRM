'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'

export type UserRegistration = {
  id: number
  name: string
  race: string
  date_of_birth: string
  sex: 'M' | 'F' | 'Other'
  place_of_birth: string
  license_number: string
  issue_date: string
  vehicle_no: string
  make_model: string
  vehicle_type: string
  vehicle_attachment_1: string
  vehicle_scheme: string
  chassis_no: string
  propellant: string
  engine_no: string
  motor_no: string
  engine_capacity: number
  power_rating: number
  maximum_power_output: number
  maximum_laden_weight: number
  unladen_weight: number
  year_of_manufacture: number
  original_registration_date: string
  lifespan_expiry_date: string
  coe_category: string
  pqp_paid: number
  coe_expiry_date: string
  road_tax_expiry_date: string
  parf_eligibility_expiry_date: string
  inspection_due_date: string
  intended_transfer_date: string
  created_at: string
  updated_at: string
}

type SortConfig = {
  key: keyof UserRegistration
  direction: 'asc' | 'desc'
}

const ITEMS_PER_PAGE = 10

export default function UserRegistrationTableClient({ initialData }: { initialData: UserRegistration[] }) {
  // Ensure initialData is an array, default to empty array if not
  const [data, setData] = useState<UserRegistration[]>(Array.isArray(initialData) ? initialData : [])
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'created_at', direction: 'desc' })
  const [currentPage, setCurrentPage] = useState(1)

  // If there's no data, show a message
  if (!data.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        No data available
      </div>
    )
  }

  const sortedData = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const paginatedData = sortedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE)

  const handleSort = (key: keyof UserRegistration) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th
                key={key}
                className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort(key as keyof UserRegistration)}
              >
                <div className="flex items-center">
                  {key.replace(/_/g, ' ')}
                  {sortConfig.key === key && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {Object.values(row).map((value, cellIndex) => (
                <td key={cellIndex} className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, data.length)} of {data.length} entries
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}