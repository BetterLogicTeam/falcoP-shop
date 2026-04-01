export interface CouponShape {
  discountType: string
  discountValue: number
  maxDiscount?: number | null
}

export function calculateCouponDiscount(coupon: CouponShape, subtotal: number): number {
  if (subtotal <= 0) return 0

  const type = coupon.discountType.toLowerCase()
  let discount = 0

  if (type === 'percentage') {
    discount = (subtotal * coupon.discountValue) / 100
  } else {
    discount = coupon.discountValue
  }

  if (coupon.maxDiscount && coupon.maxDiscount > 0) {
    discount = Math.min(discount, coupon.maxDiscount)
  }

  discount = Math.max(0, discount)
  return Math.min(discount, subtotal)
}

