import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  actions?: boolean;
  emptyMessage?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export default function AdminTable<T extends { id: number | string }>({
  data,
  columns,
  loading = false,
  searchable = true,
  searchPlaceholder = 'Search...',
  onSearch,
  onEdit,
  onDelete,
  onView,
  actions = true,
  emptyMessage = 'No data found',
  pagination,
}: AdminTableProps<T>) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [openMenu, setOpenMenu] = useState<string | number | null>(null);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const getValue = (item: T, key: string) => {
    const keys = key.split('.');
    let value: any = item;
    for (const k of keys) {
      value = value?.[k];
    }
    return value;
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = getValue(a, sortKey);
    const bVal = getValue(b, sortKey);
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) {
    return (
      <div className={`rounded-2xl border overflow-hidden ${
        theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              {columns.map((_, j) => (
                <div
                  key={j}
                  className={`h-8 rounded animate-pulse flex-1 ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border overflow-hidden ${
      theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
    }`}>
      {searchable && (
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder={searchPlaceholder}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
                  : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-blue focus:ring-accent-blue/20'
              }`}
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}>
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  } ${col.sortable ? 'cursor-pointer select-none hover:bg-opacity-50' : ''}`}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
              ))}
              {actions && (onEdit || onDelete || onView) && (
                <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`} style={{ width: '100px' }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className={`divide-y ${theme === 'dark' ? 'divide-slate-700' : 'divide-gray-200'}`}>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className={`px-4 py-12 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className={`transition-colors ${
                    theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`px-4 py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      {col.render ? col.render(item) : String(getValue(item, String(col.key)) ?? '')}
                    </td>
                  ))}
                  {actions && (onEdit || onDelete || onView) && (
                    <td className="px-4 py-4 text-right">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === item.id ? null : item.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === 'dark' ? 'hover:bg-slate-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                          }`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {openMenu === item.id && (
                          <div className={`absolute right-0 mt-1 py-1 rounded-lg shadow-lg z-10 min-w-[120px] ${
                            theme === 'dark' ? 'bg-slate-700 border border-slate-600' : 'bg-white border border-gray-200'
                          }`}>
                            {onView && (
                              <button
                                onClick={() => { onView(item); setOpenMenu(null); }}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                                  theme === 'dark' ? 'text-gray-300 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                            )}
                            {onEdit && (
                              <button
                                onClick={() => { onEdit(item); setOpenMenu(null); }}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                                  theme === 'dark' ? 'text-gray-300 hover:bg-slate-600' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => { onDelete(item); setOpenMenu(null); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.total > pagination.limit && (
        <div className={`flex items-center justify-between px-4 py-3 border-t ${
          theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
        }`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`px-3 py-1 rounded-lg text-sm transition-colors disabled:opacity-50 ${
                theme === 'dark'
                  ? 'bg-slate-700 text-gray-300 hover:bg-slate-600 disabled:hover:bg-slate-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:hover:bg-gray-100'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page * pagination.limit >= pagination.total}
              className={`px-3 py-1 rounded-lg text-sm transition-colors disabled:opacity-50 ${
                theme === 'dark'
                  ? 'bg-slate-700 text-gray-300 hover:bg-slate-600 disabled:hover:bg-slate-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:hover:bg-gray-100'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
