"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Download,
  Printer,
  Wallet,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Users,
  Calculator,
  FileSpreadsheet,
  Send,
  Ban,
  Plus,
  Minus,
} from "lucide-react"
import { departments, payrollData } from "@/lib/data"
import { useWorkers } from "@/lib/api/hooks"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

const departmentSalaryData = [
  { name: "Sewing", total: 450000000, workers: 120 },
  { name: "Cutting", total: 180000000, workers: 45 },
  { name: "Quality", total: 95000000, workers: 25 },
  { name: "Packing", total: 120000000, workers: 35 },
  { name: "Ironing", total: 85000000, workers: 22 },
  { name: "Others", total: 150000000, workers: 40 },
]

const salaryDistribution = [
  { name: "Base Salary", value: 680000000, color: "hsl(var(--chart-1))" },
  { name: "Piece-rate", value: 720000000, color: "hsl(var(--chart-2))" },
  { name: "Bonuses", value: 45000000, color: "hsl(var(--chart-3))" },
  { name: "Deductions", value: 33500000, color: "hsl(var(--chart-5))" },
]

export default function PayrollPage() {
  const { data: workers = [] } = useWorkers()
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([])

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment =
      departmentFilter === "all" || worker.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  const toggleWorkerSelection = (workerId: string) => {
    setSelectedWorkers((prev) =>
      prev.includes(workerId)
        ? prev.filter((id) => id !== workerId)
        : [...prev, workerId]
    )
  }

  const toggleAllWorkers = () => {
    if (selectedWorkers.length === filteredWorkers.length) {
      setSelectedWorkers([])
    } else {
      setSelectedWorkers(filteredWorkers.map((w) => w.id))
    }
  }

  const totalGross = workers.reduce((sum, w) => sum + w.currentMonthSalary, 0)
  const totalBonuses = workers.reduce((sum, w) => sum + w.bonuses, 0)
  const totalPenalties = workers.reduce((sum, w) => sum + w.penalties, 0)
  const totalNet = workers.reduce((sum, w) => sum + w.finalPayable, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
          <p className="text-muted-foreground">
            Manage salaries and payments for {workers.length} workers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="jan-2024">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jan-2024">January 2024</SelectItem>
              <SelectItem value="dec-2023">December 2023</SelectItem>
              <SelectItem value="nov-2023">November 2023</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button>
            <Calculator className="mr-2 h-4 w-4" /> Calculate All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Gross</p>
                <p className="text-2xl font-bold">{(totalGross / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">UZS</p>
              </div>
              <Wallet className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bonuses</p>
                <p className="text-2xl font-bold">{(totalBonuses / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-green-500">+{workers.filter(w => w.bonuses > 0).length} workers</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Penalties</p>
                <p className="text-2xl font-bold">{(totalPenalties / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-red-500">{workers.filter(w => w.penalties > 0).length} workers</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Payable</p>
                <p className="text-2xl font-bold">{(totalNet / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">UZS</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Salary by Department</CardTitle>
            <CardDescription>Total payroll distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentSalaryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <YAxis dataKey="name" type="category" className="text-xs" width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} UZS`, "Total"]}
                  />
                  <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Salary Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Salary Components</CardTitle>
            <CardDescription>Breakdown of salary types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salaryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {salaryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${(value / 1000000).toFixed(1)}M UZS`, ""]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Status</CardTitle>
              <CardDescription>January 2024</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Paid: 398</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm">Pending: 14</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={96.6} className="flex-1 h-4" />
            <span className="text-lg font-bold">96.6%</span>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search workers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedWorkers.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {selectedWorkers.length} selected
                </Badge>
                <Button variant="outline" size="sm" onClick={() => setSelectedWorkers([])}>
                  Clear Selection
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-1 h-4 w-4" /> Add Bonus
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Bonus</DialogTitle>
                      <DialogDescription>
                        Add bonus to {selectedWorkers.length} selected workers
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Bonus Amount (UZS)</Label>
                        <Input type="number" placeholder="100,000" />
                      </div>
                      <div className="space-y-2">
                        <Label>Reason</Label>
                        <Input placeholder="e.g., Exceeding monthly target" />
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline">Cancel</Button>
                        <Button>Apply Bonus</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Minus className="mr-1 h-4 w-4" /> Add Penalty
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Penalty</DialogTitle>
                      <DialogDescription>
                        Apply penalty to {selectedWorkers.length} selected workers
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Penalty Amount (UZS)</Label>
                        <Input type="number" placeholder="50,000" />
                      </div>
                      <div className="space-y-2">
                        <Label>Reason</Label>
                        <Input placeholder="e.g., Quality violations" />
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline">Cancel</Button>
                        <Button variant="destructive">Apply Penalty</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button size="sm">
                  <Send className="mr-1 h-4 w-4" /> Process Payment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <CardTitle>Worker Payroll</CardTitle>
          <CardDescription>
            Detailed salary breakdown for all workers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={selectedWorkers.length === filteredWorkers.length && filteredWorkers.length > 0}
                    onCheckedChange={toggleAllWorkers}
                  />
                </TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead className="text-right">Pieces</TableHead>
                <TableHead className="text-right">Base</TableHead>
                <TableHead className="text-right">Piece-rate</TableHead>
                <TableHead className="text-right">Bonus</TableHead>
                <TableHead className="text-right">Penalty</TableHead>
                <TableHead className="text-right">Net Payable</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.map((worker) => {
                const pieceEarnings = worker.piecesCompleted * worker.pieceRate
                const paymentStatus = worker.id === "W005" ? "pending" : "paid"
                
                return (
                  <TableRow key={worker.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedWorkers.includes(worker.id)}
                        onCheckedChange={() => toggleWorkerSelection(worker.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={worker.photo} />
                          <AvatarFallback className="text-xs">
                            {worker.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{worker.name}</p>
                          <p className="text-xs text-muted-foreground">{worker.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{worker.department}</TableCell>
                    <TableCell>{worker.position}</TableCell>
                    <TableCell className="text-right font-mono">
                      {worker.piecesCompleted.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {(worker.baseSalary / 1000000).toFixed(1)}M
                    </TableCell>
                    <TableCell className="text-right font-mono text-blue-500">
                      {(pieceEarnings / 1000000).toFixed(1)}M
                    </TableCell>
                    <TableCell className="text-right font-mono text-green-500">
                      {worker.bonuses > 0 ? `+${(worker.bonuses / 1000).toFixed(0)}K` : "-"}
                    </TableCell>
                    <TableCell className="text-right font-mono text-red-500">
                      {worker.penalties > 0 ? `-${(worker.penalties / 1000).toFixed(0)}K` : "-"}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {(worker.finalPayable / 1000000).toFixed(2)}M
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`gap-1 ${
                          paymentStatus === "paid"
                            ? "border-green-500 text-green-500"
                            : "border-yellow-500 text-yellow-500"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${
                          paymentStatus === "paid" ? "bg-green-500" : "bg-yellow-500"
                        }`} />
                        {paymentStatus === "paid" ? "Paid" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit Salary
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Plus className="mr-2 h-4 w-4" /> Add Bonus
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Minus className="mr-2 h-4 w-4" /> Add Penalty
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Send className="mr-2 h-4 w-4" /> Process Payment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="mr-2 h-4 w-4" /> Print Slip
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Anti-cheating Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Validation Alerts
          </CardTitle>
          <CardDescription>Issues requiring supervisor review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-red-500">Unrealistic Productivity</p>
                  <Badge variant="destructive">Critical</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Worker W004 (Eldor Qodirov) reported 450 pieces in 2 hours - exceeds maximum possible rate
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">Investigate</Button>
                  <Button size="sm" variant="destructive">Reject</Button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-yellow-500">Scan Interval Warning</p>
                  <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">Warning</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  3 consecutive scans from worker W001 within 30 seconds - requires verification
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">Review</Button>
                  <Button size="sm" variant="secondary">Approve</Button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <Ban className="h-5 w-5 text-orange-500 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-orange-500">Cut vs Pack Mismatch</p>
                  <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">Attention</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Order ORD-2024-001: Cut quantity (5200) exceeds packed quantity (4850) by 7.2%
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">Check Surplus</Button>
                  <Button size="sm" variant="secondary">Mark Reviewed</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
