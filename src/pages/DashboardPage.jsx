import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { packagesAPI } from '../api'
import { useAuth } from '../hooks/useAuth'
import { STATUS_LABELS, STATUS_COLORS } from '../components/StatusBadge'
import { Package, CheckCircle, Clock, Sparkles, Eye, ThumbsUp } from 'lucide-react'

const STAT_CARDS = [
  { key: 'new',         label: 'جديد',           icon: Package,     color: 'bg-gray-50  border-gray-200',  iconColor: 'text-gray-500'   },
  { key: 'in_progress', label: 'قيد الكتابة',    icon: Clock,       color: 'bg-yellow-50 border-yellow-200', iconColor: 'text-yellow-600' },
  { key: 'written',     label: 'اتكتب',          icon: CheckCircle, color: 'bg-blue-50   border-blue-200',   iconColor: 'text-blue-600'   },
  { key: 'seo_done',    label: 'SEO جاهز',       icon: Sparkles,    color: 'bg-purple-50 border-purple-200', iconColor: 'text-purple-600' },
  { key: 'reviewed',    label: 'تمت المراجعة',   icon: Eye,         color: 'bg-orange-50 border-orange-200', iconColor: 'text-orange-600' },
  { key: 'approved',    label: 'معتمد',          icon: ThumbsUp,    color: 'bg-green-50  border-green-200',  iconColor: 'text-green-600'  },
]

// ما يشوفه كل role في الـ dashboard
const ROLE_FOCUS = {
  uploader:    { status: 'new',         label: 'الباكيجات الجديدة اللي رفعتها', cta: 'رفع باكيج جديد', ctaPath: '/packages/new' },
  writer:      { status: 'new',         label: 'الباكيجات المنتظرة للكتابة',    cta: 'ابدأ الكتابة',    ctaPath: '/packages?status=new' },
  seo_manager: { status: 'written',     label: 'الباكيجات جاهزة للـ SEO',       cta: 'ابدأ الـ SEO',    ctaPath: '/packages?status=written' },
  reviewer:    { status: 'seo_done',    label: 'الباكيجات جاهزة للمراجعة',      cta: 'ابدأ المراجعة',  ctaPath: '/packages?status=seo_done' },
  admin:       { status: null,          label: 'إجمالي الباكيجات',              cta: 'رفع باكيج جديد', ctaPath: '/packages/new' },
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])

  useEffect(() => {
    packagesAPI.stats().then(r => setStats(r.data))
    packagesAPI.list({ limit: 5 }).then(r => setRecent(r.data.slice(0, 5)))
  }, [])

  const focus = ROLE_FOCUS[user?.role] || ROLE_FOCUS.admin
  const focusCount = stats ? (focus.status ? stats[focus.status] : stats.total) : '—'

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">أهلاً، {user?.name} 👋</h2>
          <p className="text-gray-500 text-sm mt-0.5">{focus.label}: <span className="font-bold text-blue-600">{focusCount}</span></p>
        </div>
        <button className="btn-primary" onClick={() => navigate(focus.ctaPath)}>
          {focus.cta}
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, color, iconColor }) => (
          <div
            key={key}
            className={`card border p-4 cursor-pointer hover:shadow-md transition-shadow ${color}`}
            onClick={() => navigate(`/packages?status=${key}`)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{label}</span>
              <Icon size={18} className={iconColor} />
            </div>
            <p className="text-3xl font-bold mt-2 text-gray-900">
              {stats ? stats[key] : <span className="text-gray-300">...</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Recent packages */}
      <div className="card">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-medium text-gray-900">آخر الباكيجات</h3>
          <button className="text-sm text-blue-600 hover:underline" onClick={() => navigate('/packages')}>عرض الكل</button>
        </div>
        {recent.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">لا يوجد باكيجات بعد</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map(pkg => (
              <div
                key={pkg.id}
                className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/packages/${pkg.id}`)}
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{pkg.title_raw}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{pkg.category?.name}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[pkg.status]}`}>
                  {STATUS_LABELS[pkg.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
