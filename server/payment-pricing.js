import {
  COURSE_PRICES,
  ENROLLMENT_COUPON_CODE,
  ENROLLMENT_COUPON_DISCOUNT_PERCENT,
  MULTI_COURSE_DISCOUNT_PERCENT,
  MULTI_COURSE_MIN_COUNT,
  getCouponExpiryDate,
} from "../shared/pricing-config.js";

export function calculateOrderAmount(courseIds, couponCode = "") {
  if (!Array.isArray(courseIds) || courseIds.length === 0) {
    throw new Error("Select at least one course.");
  }

  const uniqueCourseIds = [...new Set(courseIds)];
  if (uniqueCourseIds.length !== courseIds.length) {
    throw new Error("Duplicate courses are not allowed.");
  }

  const prices = uniqueCourseIds.map((courseId) => {
    const price = COURSE_PRICES[courseId];
    if (!price) throw new Error("One or more selected courses are unavailable.");
    return price;
  });

  const originalAmount = prices.reduce((sum, price) => sum + price, 0);
  const multiCourseDiscount =
    uniqueCourseIds.length >= MULTI_COURSE_MIN_COUNT
      ? Math.round((originalAmount * MULTI_COURSE_DISCOUNT_PERCENT) / 100)
      : 0;
  const afterMultiCourseDiscount = originalAmount - multiCourseDiscount;
  const normalizedCoupon = String(couponCode).trim().toUpperCase();
  const couponIsValid =
    normalizedCoupon === ENROLLMENT_COUPON_CODE &&
    Date.now() <= getCouponExpiryDate().getTime();
  const couponDiscount = couponIsValid
    ? Math.round(
        (afterMultiCourseDiscount * ENROLLMENT_COUPON_DISCOUNT_PERCENT) / 100,
      )
    : 0;

  return Math.max(0, originalAmount - multiCourseDiscount - couponDiscount);
}
