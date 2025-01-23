'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

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
  const [data, setData] = useState<UserRegistration[]>(Array.isArray(initialData) ? initialData : [])
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'created_at', direction: 'desc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [automatingRow, setAutomatingRow] = useState<number | null>(null)

  if (!data.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        No data available
      </div>
    )
  }

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const paginatedData = sortedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)

  const handleSort = (key: keyof UserRegistration) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleDirectAsiaAutomation = async (rowData: UserRegistration) => {
    try {
      setAutomatingRow(rowData.id);
      
      const response = await fetch('/api/automation/direct-asia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationData: rowData }),
      });
  
      const responseText = await response.text();
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
      }
  
      try {
        const result = JSON.parse(responseText);
        alert(JSON.stringify(result, null, 2));
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
    } catch (error) {
      console.error('Automation Error:', error);
      alert(error.message);
    } finally {
      setAutomatingRow(null);
    }
  };

  const renderAutomationDropdown = (row: UserRegistration) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={automatingRow === row.id}>
          {automatingRow === row.id ? 'Processing...' : 'Automation'} <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Insurance Portal</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleDirectAsiaAutomation(row)}>
          Direct Asia
        </DropdownMenuItem>
        <DropdownMenuItem>Toyota</DropdownMenuItem>
        <DropdownMenuItem>Tesla</DropdownMenuItem>
        <DropdownMenuItem>Sugarpop</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="mb-4">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border overflow-x-auto">
          <Table className="min-w-max">
            <TableHeader>
              <TableRow>
                <TableCell className="sticky left-0 bg-white z-10">
                  Actions
                </TableCell>
                {Object.keys(data[0]).map((key) => (
                  <TableHead
                    key={key}
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort(key as keyof UserRegistration)}
                  >
                    <div className="flex items-center">
                      {key.replace(/_/g, ' ')}
                      {sortConfig.key === key && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />
                      )}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="sticky right-0 bg-white z-20">
                  Automation
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="sticky left-0 bg-white z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  {Object.values(row).map((value, cellIndex) => (
                    <TableCell key={cellIndex}>{value}</TableCell>
                  ))}
                  <TableCell className="sticky right-0 bg-white z-10">
                    {renderAutomationDropdown(row)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              size="sm"
              variant="outline"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Select
              value={currentPage.toString()}
              onValueChange={(value) => setCurrentPage(Number(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Page" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <SelectItem key={page} value={page.toString()}>
                    Page {page}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              size="sm"
              variant="outline"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
