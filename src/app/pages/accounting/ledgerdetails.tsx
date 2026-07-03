import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiRefreshCw, 
  FiCalendar,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { DatePicker } from "@/components/shared/form/Datepicker";

interface Transaction {
  id: number;
  date: string;
  voucher: string;
  type: string;
  particulars: string;
  debit: number;
  credit: number;
  balance: number;
}

const LedgerDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [fromDate, setFromDate] = useState<any>(null);
  const [toDate, setToDate] = useState<any>(null);

  const accountName = location.state?.accountName || 'Cash account';
  
  const transactions: Transaction[] = [
    {
      id: 1,
      date: '01-04-2026',
      voucher: '-',
      type: 'OPENING BALANCE',
      particulars: '-',
      debit: 100000.00,
      credit: 0,
      balance: 100000.00
    }
  ];

  const summaryData = [
    { label: 'Opening Balance', value: '1,00,000.00 Dr', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Total Debit', value: '1,00,000.00', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Total Credit', value: '0.00', color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Closing Balance', value: '1,00,000.00 Dr', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' }
  ];

  const totalDebit = transactions.reduce((sum, t) => sum + t.debit, 0);
  const totalCredit = transactions.reduce((sum, t) => sum + t.credit, 0);
  const totalBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;

  // Pagination
  const totalItems = transactions.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = transactions.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handleBack = () => {
    navigate('/accounting/ledgerreport');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-800 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{accountName.toUpperCase()}</h1>
          <p className="dark:text-dark-300 mt-1 text-sm text-gray-500">
            Cash in Hand · Opening: 1,00,000.00 Dr
          </p>
        </div>
        <button 
          className="flex items-center cursor-pointer gap-2 px-5 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-all mt-3 md:mt-0"
          onClick={handleBack}
        >
          <FiArrowLeft size={18} />
          Back
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">From</span>
            <div className="w-36">
              <DatePicker
                placeholder="From Date"
                value={fromDate}
                onChange={setFromDate}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">To</span>
            <div className="w-36">
              <DatePicker
                placeholder="To Date"
                value={toDate}
                onChange={setToDate}
              />
            </div>
          </div>
          <button className="px-4 py-1.5 bg-red-500 cursor-pointer text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all">
            Apply
          </button>
          <button className="px-4 py-1.5 bg-primary-500 cursor-pointer text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-all">
            Clear
          </button>
        </div>
        <div className="flex gap-2">
          <button className="flex h-9.5 w-9.5 items-center justify-center rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-dark-600">
            <RiFileExcel2Fill className="text-green-500 text-lg" />
          </button>
          <button className="flex h-9.5 w-9.5 items-center justify-center rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-dark-600">
            <FiRefreshCw className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {summaryData.map((item, index) => (
          <div key={index} className={`${item.bg} p-4 rounded-xl shadow-sm border border-gray-200 dark:border-dark-600`}>
            <div className="text-sm text-gray-500 dark:text-gray-400">{item.label}</div>
            <div className={`text-xl font-semibold ${item.color} mt-1`}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-dark-700 rounded-xl shadow-sm border border-gray-200 dark:border-dark-600 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-600">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Voucher</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Particulars</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Debit</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Credit</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-600">
              {currentData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors">
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.id}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.date}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.voucher}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.type}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.particulars}</td>
                  <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">{item.debit.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">{item.credit === 0 ? '—' : item.credit.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">{item.balance.toFixed(2)} DR</td>
                </tr>
              ))}

              {/* Total Row - Inside Table */}
            
<tr className="bg-gray-50 dark:bg-dark-600 font-semibold">
  <td className="px-4 py-3 text-gray-900 dark:text-white">
    TOTAL
  </td>
  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
    
  </td>
  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
    
  </td>
  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
    
  </td>
  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
    
  </td>
  <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">
    {totalDebit.toFixed(2)}
  </td>
  <td className="px-4 py-3 text-right text-red-500 dark:text-red-400">
    {totalCredit.toFixed(2)}
  </td>
  <td className="px-4 py-3 text-right text-primary-500 dark:text-primary-400">
    {totalBalance.toFixed(2)} Dr
  </td>
</tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="dark:border-dark-700 dark:bg-dark-800 flex flex-col gap-4 border-t border-gray-200 bg-white px-4 py-4 md:flex-row md:items-center">
            <div className="order-1 flex items-center justify-center gap-2 text-sm text-gray-600 md:w-1/3 md:justify-start dark:text-gray-400">
              <span>Show</span>
              <span className="font-medium">{rowsPerPage}</span>
              <span>entries</span>
            </div>

            <div className="order-2 flex justify-center md:w-1/3">
              <div className="dark:border-dark-700 dark:bg-dark-800 inline-flex items-center space-x-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="dark:hover:bg-dark-700 inline-flex size-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-gray-400"
                >
                  <FiChevronLeft className="size-4" />
                </button>

                {getPageNumbers().map((page, index) => (
                  typeof page === 'number' ? (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`inline-flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                        page === currentPage
                          ? "bg-primary-600 text-white"
                          : "dark:hover:bg-dark-700 text-gray-600 hover:bg-gray-100 dark:text-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  ) : (
                    <span key={index} className="inline-flex size-8 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
                      {page}
                    </span>
                  )
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="dark:hover:bg-dark-700 inline-flex size-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-gray-400"
                >
                  <FiChevronRight className="size-4" />
                </button>
              </div>
            </div>

            <div className="order-3 flex items-center justify-center text-sm text-gray-500 select-none md:w-1/3 md:justify-end dark:text-gray-400">
              <span>
                {totalItems === 0 ? 0 : startIndex + 1} -{" "}
                {Math.min(endIndex, totalItems)} of {totalItems} entries
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LedgerDetails;