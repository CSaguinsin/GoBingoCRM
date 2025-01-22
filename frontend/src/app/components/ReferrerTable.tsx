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

export type ReferrerInfo = {
  id: number
  referrer_company: string | null
  name: string
  contact_number: string | null
  dealership: string | null
  created_at: string | null
}

type SortConfig = {
  key: keyof ReferrerInfo
  direction: 'asc' | 'desc'
}

const ITEMS_PER_PAGE = 10

export default function ReferrerInfoTable({ initialData }: { initialData: ReferrerInfo[] }) {
  const [data, setData] = useState<ReferrerInfo[]>(Array.isArray(initialData) ? initialData : [])
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'created_at', direction: 'desc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  if (!data.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        No referrer data available
      </div>
    )
  }

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    if (!aValue && !bValue) return 0
    if (!aValue) return 1
    if (!bValue) return -1
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const paginatedData = sortedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)

  const handleSort = (key: keyof ReferrerInfo) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="mb-4">
          <Input
            placeholder="Search referrers..."
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
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    ID
                    {sortConfig.key === 'id' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('referrer_company')}
                >
                  <div className="flex items-center">
                    Company
                    {sortConfig.key === 'referrer_company' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('contact_number')}
                >
                  <div className="flex items-center">
                    Contact Number
                    {sortConfig.key === 'contact_number' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('dealership')}
                >
                  <div className="flex items-center">
                    Dealership
                    {sortConfig.key === 'dealership' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center">
                    Created At
                    {sortConfig.key === 'created_at' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />
                    )}
                  </div>
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
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.referrer_company || '-'}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.contact_number || '-'}</TableCell>
                  <TableCell>{row.dealership || '-'}</TableCell>
                  <TableCell>{row.created_at || '-'}</TableCell>
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