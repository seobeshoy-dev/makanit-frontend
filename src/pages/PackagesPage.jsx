import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { packagesAPI, categoriesAPI } from '../api'
import { useAuth } from '../hooks/useAuth'
import { StatusBadge, formatDate } from '../components/StatusBadge'
import { Plus, Search, Filter } from 'lucide-react'

const STATUSES = ['', 'new', 'in_progress', 'written', 'seo_done', 'reviewed', 'approved']
const STATUS_AR = { '': 'الكل', new: 'جديد', in_progress: 'قيد الكتابة', written: 'اتكتب', seo_done: 'SEO جاهز', reviewed: 'تمت المراجعة', approved: 'معتمد' }

export default function PackagesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [packages, setPackages] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const status = searchParams.get('status') || ''
  const categoryId = searchParams.get('category_id') || ''
  const search = searchParams.get('search') || ''

  useEffect(() => {
    categoriesAPI.list().then(r => setCategories(r.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (status) params.status = status
    if (categoryId) params.category_id = categoryId
    if (search) params.search = search
    packagesAPI.list(params)
      .then(r => setPackages(r.data))
      .finally(() => setLoading(false))
  }, [status, categoryId, search])

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val); else p.delete(key)
    setSearchParams(p)
  }

  const canCreate = ['uploader', 'admin'].includes(user?.role)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">الباكيجات</h2>
        {canCreate && (
          <button className="btn-primary flex items-center gap-2" onClick={() => navigate('/packages/new')}>
            <Plus size={16} /> باكيج جديد
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pr-9"
            placeholder="بحث باسم الباكيج أو الفندق..."
            value={search}
            onChange={e => setParam('search', e.target.value)}
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setParam('status', s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                status === s
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {STATUS_AR[s]}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <select
          className="input w-auto"
          value={categoryId}
          onChange={e => setParam('category_id', e.target.value)}
        >
          <option value="">كل الكاتيجريز</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          </div>
        ) : packages.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Package size={40} className="mx-auto mb-3 opacity-30" />
            <p>لا يوجد باكيجات بهذه الفلاتر</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-4 py-3 font-medium text-gray-600">الباكيج</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">الكاتيجري</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">السعر</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">الحالة</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {packages.map(pkg => (
                <tr
                  key={pkg.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/packages/${pkg.id}`)}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{pkg.title_raw}</p>
                    {pkg.hotel_name && <p className="text-xs text-gray-400 mt-0.5">{pkg.hotel_name}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{pkg.category?.name}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {pkg.price ? `${pkg.price} ${pkg.currency}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={pkg.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-400">{formatDate(pkg.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
