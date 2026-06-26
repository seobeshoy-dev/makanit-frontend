import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { packagesAPI, categoriesAPI } from '../api'
import toast from 'react-hot-toast'
import { ArrowRight } from 'lucide-react'

export default function NewPackagePage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title_raw: '', hotel_name: '', room_type: '', category_id: '',
    raw_details: '', travel_dates: '', price: '', currency: 'AED', duration_nights: '',
  })

  useEffect(() => {
    categoriesAPI.list().then(r => {
      setCategories(r.data)
      if (r.data.length > 0) setForm(f => ({ ...f, category_id: r.data[0].id }))
    })
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title_raw.trim() || !form.raw_details.trim() || !form.category_id) {
      toast.error('اسم الباكيج والتفاصيل والكاتيجري مطلوبين')
      return
    }
    setLoading(true)
    try {
      const payload = { ...form, price: form.price ? parseFloat(form.price) : null }
      const { data } = await packagesAPI.create(payload)
      toast.success('تم رفع الباكيج بنجاح!')
      navigate(`/packages/${data.id}`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/packages')} className="text-gray-400 hover:text-gray-600">
          <ArrowRight size={20} />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">رفع باكيج جديد</h2>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {/* Basic info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label">اسم الباكيج *</label>
            <input className="input" placeholder="مثال: المالديف — Kurumba Resort" value={form.title_raw} onChange={e => set('title_raw', e.target.value)} required />
          </div>
          <div>
            <label className="label">اسم الفندق</label>
            <input className="input" placeholder="Kurumba Maldives" value={form.hotel_name} onChange={e => set('hotel_name', e.target.value)} />
          </div>
          <div>
            <label className="label">نوع الغرفة</label>
            <input className="input" placeholder="Garden Pool Villa" value={form.room_type} onChange={e => set('room_type', e.target.value)} />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="label">الكاتيجري *</label>
          <select className="input" value={form.category_id} onChange={e => set('category_id', e.target.value)} required>
            <option value="">اختر...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Raw details */}
        <div>
          <label className="label">التفاصيل الخام *</label>
          <p className="text-xs text-gray-400 mb-1">انسخ تفاصيل الباكيج كما وصلتك</p>
          <textarea
            className="input min-h-32 resize-y font-mono text-xs"
            placeholder="◼️ 4 ايام – 3 ليالي&#10;◼️ افطار وعشاء&#10;◼️ توصيل من والى المطار..."
            value={form.raw_details}
            onChange={e => set('raw_details', e.target.value)}
            required
          />
        </div>

        {/* Dates & Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">تواريخ السفر</label>
            <input className="input" placeholder="يونيو - يوليو 2025" value={form.travel_dates} onChange={e => set('travel_dates', e.target.value)} />
          </div>
          <div>
            <label className="label">المدة</label>
            <input className="input" placeholder="4 ايام - 3 ليالي" value={form.duration_nights} onChange={e => set('duration_nights', e.target.value)} />
          </div>
          <div>
            <label className="label">السعر</label>
            <input className="input" type="number" placeholder="5950" value={form.price} onChange={e => set('price', e.target.value)} />
          </div>
          <div>
            <label className="label">العملة</label>
            <select className="input" value={form.currency} onChange={e => set('currency', e.target.value)}>
              <option value="AED">AED — درهم إماراتي</option>
              <option value="USD">USD — دولار</option>
              <option value="EGP">EGP — جنيه مصري</option>
              <option value="SAR">SAR — ريال سعودي</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={() => navigate('/packages')}>إلغاء</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'جاري الرفع...' : 'رفع الباكيج'}
          </button>
        </div>
      </form>
    </div>
  )
}
