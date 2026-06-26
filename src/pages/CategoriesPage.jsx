import { useEffect, useState } from 'react'
import { categoriesAPI } from '../api'
import toast from 'react-hot-toast'
import { Plus, ExternalLink } from 'lucide-react'

const TYPE_AR = { destination: 'وجهة', cruise: 'كروز', season: 'موسم' }
const TYPE_COLORS = {
  destination: 'bg-blue-50 text-blue-700',
  cruise:      'bg-teal-50 text-teal-700',
  season:      'bg-orange-50 text-orange-700',
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', country_url: '', type: 'destination' })
  const [saving, setSaving] = useState(false)

  const load = () => categoriesAPI.list().then(r => setCategories(r.data))
  useEffect(() => { load() }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await categoriesAPI.create(form)
      toast.success('تمت إضافة الكاتيجري')
      setForm({ name: '', slug: '', country_url: '', type: 'destination' })
      setShowForm(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'حدث خطأ')
    } finally {
      setSaving(false)
    }
  }

  const grouped = categories.reduce((acc, c) => {
    acc[c.type] = acc[c.type] || []
    acc[c.type].push(c)
    return acc
  }, {})

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">الكاتيجريز</h2>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(s => !s)}>
          <Plus size={16} /> إضافة كاتيجري
        </button>
      </div>

      {showForm && (
        <div className="card p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">الاسم</label>
                <input className="input" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Maldives" />
              </div>
              <div>
                <label className="label">Slug</label>
                <input className="input" value={form.slug} onChange={e => set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))} required placeholder="maldives" />
              </div>
              <div>
                <label className="label">رابط الموقع</label>
                <input className="input" value={form.country_url} onChange={e => set('country_url', e.target.value)} placeholder="https://makanit.ae/destination/maldives/" />
              </div>
              <div>
                <label className="label">النوع</label>
                <select className="input" value={form.type} onChange={e => set('type', e.target.value)}>
                  <option value="destination">وجهة</option>
                  <option value="cruise">كروز</option>
                  <option value="season">موسم</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>إلغاء</button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </div>
          </form>
        </div>
      )}

      {Object.entries(grouped).map(([type, cats]) => (
        <div key={type} className="card overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${TYPE_COLORS[type]}`}>
              {TYPE_AR[type]}
            </span>
            <span className="text-xs text-gray-400 mr-2">{cats.length} كاتيجري</span>
          </div>
          <div className="divide-y divide-gray-50">
            {cats.map(c => (
              <div key={c.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900">{c.name}</span>
                  <span className="text-xs text-gray-400 mr-2">/{c.slug}</span>
                </div>
                {c.country_url && (
                  <a href={c.country_url} target="_blank" rel="noreferrer"
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
