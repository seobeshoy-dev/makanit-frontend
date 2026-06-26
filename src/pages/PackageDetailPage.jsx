import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { packagesAPI } from '../api'
import { useAuth } from '../hooks/useAuth'
import { StatusBadge, formatDateTime, STATUS_LABELS } from '../components/StatusBadge'
import toast from 'react-hot-toast'
import { ArrowRight, Clock, User, ChevronDown, ChevronUp } from 'lucide-react'

// ── Section wrapper ───────────────────────────────────
function Section({ title, badge, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="card overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-gray-900">{title}</h3>
          {badge && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{badge}</span>}
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}

// ── Writer form ───────────────────────────────────────
function WriterSection({ pkg, onRefresh }) {
  const [body, setBody] = useState(pkg.content?.body || '')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!body.trim()) { toast.error('المحتوى فاضي'); return }
    setSaving(true)
    try {
      await packagesAPI.writeContent(pkg.id, body)
      toast.success('تم حفظ المحتوى ✓')
      onRefresh()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'حدث خطأ')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3">
      <textarea
        className="input min-h-64 resize-y text-sm leading-relaxed"
        placeholder="اكتبي محتوى صفحة الباكيج هنا..."
        value={body}
        onChange={e => setBody(e.target.value)}
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">{body.length} حرف</p>
        <button className="btn-primary" onClick={save} disabled={saving}>
          {saving ? 'جاري الحفظ...' : 'حفظ وتحديث الحالة'}
        </button>
      </div>
      {pkg.content && (
        <p className="text-xs text-gray-400">
          آخر تعديل: {formatDateTime(pkg.content.updated_at)} بواسطة {pkg.content.writer?.name}
        </p>
      )}
    </div>
  )
}

// ── SEO form ──────────────────────────────────────────
function SEOSection({ pkg, onRefresh }) {
  const [form, setForm] = useState({
    page_title: pkg.seo?.page_title || '',
    meta_title: pkg.seo?.meta_title || '',
    meta_description: pkg.seo?.meta_description || '',
    primary_kw: pkg.seo?.primary_kw || '',
    secondary_kw: pkg.seo?.secondary_kw || '',
  })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.page_title || !form.meta_title || !form.meta_description || !form.primary_kw) {
      toast.error('كل الحقول مطلوبة ماعدا الـ KW الثانوي')
      return
    }
    setSaving(true)
    try {
      await packagesAPI.addSEO(pkg.id, form)
      toast.success('تم حفظ الـ SEO ✓')
      onRefresh()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'حدث خطأ')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="label">عنوان الصفحة (H1)</label>
        <input className="input" value={form.page_title} onChange={e => set('page_title', e.target.value)} placeholder="عنوان الصفحة الرئيسي" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="label mb-0">Meta Title</label>
          <span className={`text-xs ${form.meta_title.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
            {form.meta_title.length}/60
          </span>
        </div>
        <input className="input" value={form.meta_title} onChange={e => set('meta_title', e.target.value)} placeholder="عنوان الـ SEO (60 حرف كحد أقصى)" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="label mb-0">Meta Description</label>
          <span className={`text-xs ${form.meta_description.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
            {form.meta_description.length}/160
          </span>
        </div>
        <textarea
          className="input min-h-20 resize-none"
          value={form.meta_description}
          onChange={e => set('meta_description', e.target.value)}
          placeholder="وصف الصفحة للسيرش إنجن (160 حرف كحد أقصى)"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">الـ Keyword الرئيسي</label>
          <input className="input" value={form.primary_kw} onChange={e => set('primary_kw', e.target.value)} placeholder="باقات سياحية المالديف" />
        </div>
        <div>
          <label className="label">الـ Keyword الثانوي</label>
          <input className="input" value={form.secondary_kw} onChange={e => set('secondary_kw', e.target.value)} placeholder="عروض سفر المالديف" />
        </div>
      </div>
      <div className="flex justify-end">
        <button className="btn-primary" onClick={save} disabled={saving}>
          {saving ? 'جاري الحفظ...' : 'حفظ الـ SEO'}
        </button>
      </div>
      {pkg.seo && (
        <p className="text-xs text-gray-400">
          آخر تعديل: {formatDateTime(pkg.seo.updated_at)} بواسطة {pkg.seo.seo_manager?.name}
        </p>
      )}
    </div>
  )
}

// ── Reviewer actions ──────────────────────────────────
function ReviewerSection({ pkg, onRefresh }) {
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const act = async (action) => {
    if (action === 'revision' && !note.trim()) {
      toast.error('لازم تكتب ملاحظة لطلب التعديل')
      return
    }
    setLoading(true)
    try {
      if (action === 'review') await packagesAPI.review(pkg.id, note)
      else if (action === 'approve') await packagesAPI.approve(pkg.id, note)
      else await packagesAPI.requestRevision(pkg.id, note)
      toast.success(action === 'revision' ? 'تم إرجاع الباكيج للتعديل' : 'تم بنجاح ✓')
      onRefresh()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="label">ملاحظة (اختياري للموافقة، مطلوبة للإرجاع)</label>
        <textarea
          className="input min-h-20 resize-none"
          placeholder="اكتب ملاحظتك هنا..."
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </div>
      <div className="flex gap-3">
        {pkg.status === 'seo_done' && (
          <button className="btn-primary" onClick={() => act('review')} disabled={loading}>
            مراجعة ✓
          </button>
        )}
        {pkg.status === 'reviewed' && (
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            onClick={() => act('approve')} disabled={loading}
          >
            اعتماد نهائي ✓
          </button>
        )}
        {['written', 'seo_done', 'reviewed'].includes(pkg.status) && (
          <button className="btn-danger" onClick={() => act('revision')} disabled={loading}>
            إرجاع للتعديل
          </button>
        )}
      </div>
    </div>
  )
}

// ── Activity log ──────────────────────────────────────
function ActivitySection({ pkgId }) {
  const [log, setLog] = useState([])
  useEffect(() => {
    packagesAPI.getActivity(pkgId).then(r => setLog(r.data))
  }, [pkgId])

  return (
    <div className="space-y-3">
      {log.length === 0 ? (
        <p className="text-sm text-gray-400">لا يوجد نشاط بعد</p>
      ) : (
        log.map(entry => (
          <div key={entry.id} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <User size={13} className="text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-900">{entry.user?.name}</span>
                <span className="text-sm text-gray-600">{entry.action}</span>
                {entry.old_status && entry.new_status && (
                  <span className="text-xs text-gray-400">
                    {STATUS_LABELS[entry.old_status]} ← {STATUS_LABELS[entry.new_status]}
                  </span>
                )}
              </div>
              {entry.note && <p className="text-xs text-gray-500 mt-0.5 bg-gray-50 rounded px-2 py-1">{entry.note}</p>}
              <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                <Clock size={11} /> {formatDateTime(entry.created_at)}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────
export default function PackageDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    packagesAPI.get(id).then(r => setPkg(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  )
  if (!pkg) return <div className="p-6 text-gray-500">الباكيج مش موجود</div>

  const isWriter  = user?.role === 'writer'      || user?.role === 'admin'
  const isSEO     = user?.role === 'seo_manager' || user?.role === 'admin'
  const isReviewer= user?.role === 'reviewer'    || user?.role === 'admin'
  const canWrite  = isWriter  && ['new', 'in_progress'].includes(pkg.status)
  const canSEO    = isSEO     && ['written', 'seo_done'].includes(pkg.status)
  const canReview = isReviewer && ['seo_done', 'reviewed'].includes(pkg.status)

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button onClick={() => navigate('/packages')} className="text-gray-400 hover:text-gray-600 mt-1">
          <ArrowRight size={20} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-semibold text-gray-900">{pkg.title_raw}</h2>
            <StatusBadge status={pkg.status} />
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {pkg.category?.name} · رفعه {pkg.uploader?.name} · {formatDateTime(pkg.created_at)}
          </p>
        </div>
      </div>

      {/* Raw details */}
      <Section title="التفاصيل الخام" defaultOpen>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          {pkg.hotel_name    && <div><span className="text-gray-400">الفندق: </span><span className="font-medium">{pkg.hotel_name}</span></div>}
          {pkg.room_type     && <div><span className="text-gray-400">الغرفة: </span><span className="font-medium">{pkg.room_type}</span></div>}
          {pkg.travel_dates  && <div><span className="text-gray-400">التواريخ: </span><span className="font-medium">{pkg.travel_dates}</span></div>}
          {pkg.duration_nights && <div><span className="text-gray-400">المدة: </span><span className="font-medium">{pkg.duration_nights}</span></div>}
          {pkg.price         && <div><span className="text-gray-400">السعر: </span><span className="font-medium">{pkg.price} {pkg.currency}</span></div>}
        </div>
        <pre className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 whitespace-pre-wrap font-mono leading-relaxed border border-gray-100">
          {pkg.raw_details}
        </pre>
      </Section>

      {/* Content */}
      <Section
        title="محتوى الصفحة"
        badge={pkg.content ? '✓ مكتوب' : 'ينتظر الكتابة'}
        defaultOpen={canWrite || !!pkg.content}
      >
        {canWrite ? (
          <WriterSection pkg={pkg} onRefresh={load} />
        ) : pkg.content ? (
          <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {pkg.content.body}
          </div>
        ) : (
          <p className="text-sm text-gray-400">لم يتم كتابة المحتوى بعد</p>
        )}
      </Section>

      {/* SEO */}
      <Section
        title="بيانات الـ SEO"
        badge={pkg.seo ? '✓ مضاف' : 'ينتظر الـ SEO'}
        defaultOpen={canSEO || !!pkg.seo}
      >
        {canSEO ? (
          <SEOSection pkg={pkg} onRefresh={load} />
        ) : pkg.seo ? (
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-400">عنوان الصفحة: </span><span className="font-medium">{pkg.seo.page_title}</span></div>
            <div><span className="text-gray-400">Meta Title: </span><span className="font-medium">{pkg.seo.meta_title}</span></div>
            <div><span className="text-gray-400">Meta Desc: </span><span className="font-medium">{pkg.seo.meta_description}</span></div>
            <div><span className="text-gray-400">KW رئيسي: </span><span className="font-medium">{pkg.seo.primary_kw}</span></div>
            {pkg.seo.secondary_kw && <div><span className="text-gray-400">KW ثانوي: </span><span className="font-medium">{pkg.seo.secondary_kw}</span></div>}
          </div>
        ) : (
          <p className="text-sm text-gray-400">لم يتم إضافة الـ SEO بعد</p>
        )}
      </Section>

      {/* Reviewer actions */}
      {canReview && (
        <Section title="مراجعة الباكيج" defaultOpen>
          <ReviewerSection pkg={pkg} onRefresh={load} />
        </Section>
      )}

      {/* Activity log */}
      <Section title="سجل الأنشطة" defaultOpen={false}>
        <ActivitySection pkgId={pkg.id} />
      </Section>
    </div>
  )
}
