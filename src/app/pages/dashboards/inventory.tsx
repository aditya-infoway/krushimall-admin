import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  RadialBarChart,
  RadialBar,
  LineChart,
  BarChart,
  Bar,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer
} from "recharts";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// ---------- Types ----------
interface Member {
  id: number;
  name: string;
  amount: number;
}

interface Transaction {
  memberId: number;
  name: string;
  amount: number;
  txnId: string;
}

interface WeeklySalesData {
  day: string;
  sales: number;
}

interface RevenueData {
  name: string;
  value: number;
}

interface OrderData {
  value: number;
}

interface PieData {
  name: string;
  value: number;
}

interface CustomerData {
  name: string;
  value: number;
  fill: string;
}

interface SalesData {
  week: number;
  sales: number;
}

interface MiniBarData {
  name: string;
  value: number;
}

interface MiniLineData {
  name: string;
  value: number;
}

interface ModelAnalysisRow {
  model: string;
  present: number;
  transit: number;
  purchase: number;
  sales: number;
}

interface MainTableRow {
  srNo: number;
  model: string;
  variant: string;
  colour: string;
  purchaseOrder: string;
  present: number;
  transit: number;
  hot: number;
  booked: number;
  lost: number;
}

export default function Dashboard() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage] = React.useState(10);

  const members: Member[] = [
    { id: 101, name: "Nitin", amount: 5000 },
    { id: 102, name: "Rahul", amount: 3200 },
    { id: 103, name: "Amit", amount: 7800 },
    { id: 104, name: "Vikas", amount: 4500 },
    { id: 105, name: "Suresh", amount: 6100 },
    { id: 106, name: "Bhavik", amount: 8100 },
    { id: 107, name: "Ram", amount: 7100 },
    { id: 108, name: "Dipesh", amount: 9100 },
    { id: 109, name: "Dixit", amount: 5100 },
  ];

  const transactions: Transaction[] = [
    { memberId: 101, name: "Nitin", amount: 5000, txnId: "TXN001" },
    { memberId: 102, name: "Rahul", amount: 3200, txnId: "TXN002" },
    { memberId: 103, name: "Amit", amount: 7800, txnId: "TXN003" },
    { memberId: 104, name: "Vikas", amount: 4500, txnId: "TXN004" },
    { memberId: 105, name: "Suresh", amount: 6100, txnId: "TXN005" },
    { memberId: 106, name: "Kunal", amount: 2900, txnId: "TXN006" },
    { memberId: 107, name: "Rohit", amount: 8800, txnId: "TXN007" },
    { memberId: 108, name: "Pankaj", amount: 5400, txnId: "TXN008" },
    { memberId: 109, name: "Jay", amount: 3600, txnId: "TXN009" },
    { memberId: 110, name: "Manish", amount: 9200, txnId: "TXN010" },
  ];

  const modelAnalysisData: ModelAnalysisRow[] = [
    { model: "Mahindra 265 DI", present: 45, transit: 12, purchase: 8, sales: 25 },
    { model: "Swaraj 744 FE", present: 38, transit: 15, purchase: 10, sales: 20 },
    { model: "Eicher 380", present: 52, transit: 8, purchase: 6, sales: 30 },
    { model: "John Deere 5050", present: 28, transit: 20, purchase: 12, sales: 18 },
    { model: "New Holland 3630", present: 33, transit: 10, purchase: 7, sales: 22 },
  ];

  const mainTableData: MainTableRow[] = [
    { srNo: 1, model: "Mahindra 265 DI", variant: "Deluxe", colour: "Red", purchaseOrder: "PO-001", present: 45, transit: 12, hot: 18, booked: 10, lost: 5 },
    { srNo: 2, model: "Swaraj 744 FE", variant: "Standard", colour: "Blue", purchaseOrder: "PO-002", present: 38, transit: 15, hot: 12, booked: 8, lost: 3 },
    { srNo: 3, model: "Eicher 380", variant: "Premium", colour: "Green", purchaseOrder: "PO-003", present: 52, transit: 8, hot: 20, booked: 15, lost: 7 },
    { srNo: 4, model: "John Deere 5050", variant: "Base", colour: "Yellow", purchaseOrder: "PO-004", present: 28, transit: 20, hot: 10, booked: 5, lost: 2 },
    { srNo: 5, model: "New Holland 3630", variant: "Plus", colour: "White", purchaseOrder: "PO-005", present: 33, transit: 10, hot: 15, booked: 12, lost: 4 },
    { srNo: 6, model: "Mahindra 575 DI", variant: "Premium", colour: "Black", purchaseOrder: "PO-006", present: 40, transit: 18, hot: 22, booked: 14, lost: 6 },
    { srNo: 7, model: "Swaraj 855 FE", variant: "Deluxe", colour: "Orange", purchaseOrder: "PO-007", present: 25, transit: 22, hot: 8, booked: 6, lost: 3 },
    { srNo: 8, model: "Eicher 480", variant: "Standard", colour: "Red", purchaseOrder: "PO-008", present: 48, transit: 6, hot: 25, booked: 18, lost: 8 },
    { srNo: 9, model: "John Deere 5075", variant: "Premium", colour: "Green", purchaseOrder: "PO-009", present: 30, transit: 14, hot: 12, booked: 9, lost: 4 },
    { srNo: 10, model: "New Holland 4710", variant: "Base", colour: "Blue", purchaseOrder: "PO-010", present: 22, transit: 25, hot: 6, booked: 4, lost: 2 },
    { srNo: 11, model: "Mahindra 265 DI", variant: "Plus", colour: "White", purchaseOrder: "PO-011", present: 35, transit: 16, hot: 14, booked: 11, lost: 5 },
    { srNo: 12, model: "Swaraj 744 FE", variant: "Premium", colour: "Black", purchaseOrder: "PO-012", present: 42, transit: 9, hot: 20, booked: 16, lost: 6 },
  ];

  // Pie chart data
  const pieChartData: PieData[] = [
    { name: "Present", value: 35 },
    { name: "Transit", value: 25 },
    { name: "Hot", value: 20 },
    { name: "Booked", value: 15 },
    { name: "Lost", value: 5 },
  ];

  const PIE_COLORS = ["#22c55e", "#3b82f6", "#ef4444", "#8b5cf6", "#6b7280"];

  // Pagination logic
  const totalItems = mainTableData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = mainTableData.slice(indexOfFirstItem, indexOfLastItem);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 12;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 6) {
        for (let i = 1; i <= 10; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 5) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 9; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 4; i <= currentPage + 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-dark-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Dashboard</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">Welcome to the admin dashboard!</p>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Hot Lead</p>
              <p className="text-3xl font-bold mt-1">100</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 bg-white/20 rounded-full text-xs font-medium">+12%</span>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Warm Lead</p>
              <p className="text-3xl font-bold mt-1">200</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 bg-white/20 rounded-full text-xs font-medium">+8%</span>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Cold Lead</p>
              <p className="text-3xl font-bold mt-1">300</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 bg-white/20 rounded-full text-xs font-medium">-3%</span>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Booked Lead</p>
              <p className="text-3xl font-bold mt-1">400</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 bg-white/20 rounded-full text-xs font-medium">+25%</span>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Pie Chart + Model Analysis in one row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left - Pie Chart */}
        <div className="bg-white dark:bg-dark-700 rounded-2xl shadow p-6 border border-gray-200 dark:border-dark-600 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lead Distribution</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}`, 'Count']}
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{
                    paddingTop: '10px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right - Model Analysis Table */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-700 rounded-2xl shadow p-6 border border-gray-200 dark:border-dark-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Model Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 dark:bg-dark-600">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Model</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Present</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transit</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purchase</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-dark-600">
                {modelAnalysisData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{item.model}</td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">{item.present}</td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">{item.transit}</td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">{item.purchase}</td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">{item.sales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-dark-700 rounded-2xl shadow border border-gray-200 dark:border-dark-600 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Inventory Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50 dark:bg-dark-600">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sr No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Model</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Variant</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Colour</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purchase Order</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Present</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transit</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hot</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Booked</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-600">
              {currentItems.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors">
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{item.srNo}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{item.model}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{item.variant}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="inline-block w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: item.colour.toLowerCase() }} />
                      <span className="text-gray-600 dark:text-gray-300">{item.colour}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{item.purchaseOrder}</td>
                  <td className="px-4 py-3 text-center text-green-600 dark:text-green-400 font-medium">{item.present}</td>
                  <td className="px-4 py-3 text-center text-blue-600 dark:text-blue-400 font-medium">{item.transit}</td>
                  <td className="px-4 py-3 text-center text-red-600 dark:text-red-400 font-medium">{item.hot}</td>
                  <td className="px-4 py-3 text-center text-purple-600 dark:text-purple-400 font-medium">{item.booked}</td>
                  <td className="px-4 py-3 text-center text-gray-500 dark:text-gray-400 font-medium">{item.lost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-800">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-0">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            
            {getPageNumbers().map((page, index) => (
              typeof page === 'number' ? (
                <button
                  key={index}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-green-600 text-white shadow-md shadow-green-600/30'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-600'
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="w-8 h-8 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  {page}
                </span>
              )
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}