export const STATUS_LABELS = {
  new: 'جديد',
  in_progress: 'قيد الكتابة',
  written: 'اتكتب',
  seo_done: 'SEO جاهز',
  reviewed: 'تمت المراجعة',
  approved: 'معتمد',
}

export const STATUS_COLORS = {
  new:         'bg-gray-100 text-gray-700',
  in_progress: 'bg-yellow-100 text-yellow-800',
  written:     'bg-blue-100 text-blue-800',
  seo_done:    'bg-purple-100 text-purple-800',
  reviewed:    'bg-orange-100 text-orange-800',
  approved:    'bg-green-100 text-green-800',
}

export const ROLE_LABELS = {
  uploader:    'رافع الباكيجات',
  writer:      'الكاتبة',
  seo_manager: 'SEO Manager',
  reviewer:    'المراجع',
  admin:       'Admin',
}

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-700'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('ar-EG', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}
