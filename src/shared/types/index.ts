// ─── Enums ────────────────────────────────────────────────────────────────────

export enum PaymentMethod {
  Cash = 'cash',
  Qris = 'qris',
  DebitCard = 'debit_card',
  CreditCard = 'credit_card',
  BankTransfer = 'bank_transfer',
}

export enum TransactionStatus {
  Pending = 'pending',
  Completed = 'completed',
  Voided = 'voided',
  Refunded = 'refunded',
  OnHold = 'on_hold',
}

export enum UserRole {
  Owner = 'owner',
  Admin = 'admin',
  Cashier = 'cashier',
}

export enum StockLogType {
  Sale = 'sale',
  Restock = 'restock',
  Adjustment = 'adjustment',
  Return = 'return',
}

// ─── Core Domain Types ────────────────────────────────────────────────────────

export interface Category {
  id?: number
  uuid: string
  name: string
  description: string | null
  sortOrder: number
  createdAt: Date
  updatedAt: Date
  syncedAt: Date | null
}

export interface Product {
  id?: number
  uuid: string
  sku: string
  name: string
  description: string | null
  categoryId: string
  price: number
  costPrice: number
  stock: number
  lowStockThreshold: number
  imageUrl: string | null
  barcode: string | null
  isActive: boolean
  hasVariants: boolean
  createdAt: Date
  updatedAt: Date
  syncedAt: Date | null
}

export interface ProductVariant {
  id?: number
  uuid: string
  productId: string
  name: string
  sku: string
  price: number
  stock: number
  createdAt: Date
  updatedAt: Date
  syncedAt: Date | null
}

export interface Transaction {
  id?: number
  uuid: string
  receiptNumber: string
  cashierId: string
  cashierName: string
  subtotal: number
  discountAmount: number
  taxAmount: number
  total: number
  paymentMethod: PaymentMethod
  amountPaid: number
  changeAmount: number
  status: TransactionStatus
  notes: string | null
  createdAt: Date
  updatedAt: Date
  syncedAt: Date | null
}

export interface TransactionItem {
  id?: number
  uuid: string
  transactionId: string
  productId: string
  productName: string
  productSku: string
  variantId: string | null
  variantName: string | null
  quantity: number
  unitPrice: number
  discountAmount: number
  subtotal: number
  createdAt: Date
  syncedAt: Date | null
}

export interface StockLog {
  id?: number
  uuid: string
  productId: string
  type: StockLogType
  quantityBefore: number
  quantityChange: number
  quantityAfter: number
  referenceId: string | null
  notes: string | null
  performedBy: string
  createdAt: Date
  syncedAt: Date | null
}

export interface User {
  id?: number
  uuid: string
  email: string
  fullName: string
  role: UserRole
  pin: string | null
  isActive: boolean
  lastLoginAt: Date | null
  createdAt: Date
  updatedAt: Date
  syncedAt: Date | null
}

// ─── UI / Application Types ───────────────────────────────────────────────────

export interface CartItem {
  product: Product
  variant: ProductVariant | null
  quantity: number
  unitPrice: number
  discountAmount: number
  subtotal: number
}

export interface CartTotals {
  subtotal: number
  discountAmount: number
  taxAmount: number
  total: number
}

export interface CheckoutPayload {
  items: CartItem[]
  paymentMethod: PaymentMethod
  amountPaid: number
  discountAmount: number
  notes: string | null
}

export interface DateRange {
  from: Date
  to: Date
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasNextPage: boolean
}
