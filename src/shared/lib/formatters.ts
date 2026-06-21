export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function generateReceiptNumber(sequenceNumber: number): string {
  const today = new Date()
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, '')
  const seqPart = String(sequenceNumber).padStart(4, '0')
  return `TRX-${datePart}-${seqPart}`
}
