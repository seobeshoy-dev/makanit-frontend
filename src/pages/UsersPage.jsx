import { useState } from 'react'
import { authAPI } from '../api'
import { ROLE_LABELS } from '../components/StatusBadge'
import toast from 'react-hot-toast'
import { UserPlus } from 'lucide-react'

const ROLES = ['uploader', 'writer', 'seo_manager', 'reviewer', 'admin']

export default function UsersPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'writer' })
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState([])
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await authAPI.register(form)
      toast.success(`تم إنشاء حساب ${data.name} بنجاح!`)
      setCreated(c => [data, ...c])
      setForm({ name: '', email: '', password: '', role: 'writer' })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">إدارة المستخدمين</h2>

      <div className="card p-6 space-y-5">
        <h3 className="font-medium text-gray-900 flex items-center gap-2">
          <UserPlus size={18} /> إضافة مستخدم جديد
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">الاسم</label>
              <input className="input" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div>
              <label className="label">الإيميل</label>
              <input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
            <div>
              <label className="label">الباسورد</label>
              <input className="input" type="password" value={form.password} onChange={e => set('password', e.target.value)} required minLength={8} />
            </div>
            <div>
              <label className="label">الدور</label>
              <select className="input" value={form.role} onChange={e => set('role', e.target.value)}>
                {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
            </button>
          </div>
        </form>
      </div>

      {created.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-medium text-gray-900">الحسابات المُنشأة في هذه الجلسة</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {created.map(u => (
              <div key={u.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                  {ROLE_LABELS[u.role]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
