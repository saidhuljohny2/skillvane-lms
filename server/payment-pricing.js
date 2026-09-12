const COURSE_PRICES = Object.freeze({
  "multi-cloud-live": 22000,
  "gcp-live": 14999,
  "gcp-recordings": 6999,
  "multi-cloud-recordings": 10999,
  "python-de": 1,
  "project-healthcare": 899,
  "project-retail": 899,
  "project-banking": 899,
});

const MULTI_COURSE_DISCOUNT_PERCENT = 10;
const ENROLLMENT_COUPON_CODE = "SKILLVANE10";
const ENROLLMENT_COUPON_DISCOUNT_PERCENT = 10;
const ENROLLMENT_COUPON_EXPIRY = new Date("2026-06-30T00:00:00+05:30");

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
    uniqueCourseIds.length >= 2
      ? Math.round((originalAmount * MULTI_COURSE_DISCOUNT_PERCENT) / 100)
      : 0;
  const afterMultiCourseDiscount = originalAmount - multiCourseDiscount;
  const normalizedCoupon = String(couponCode).trim().toUpperCase();
  const couponIsValid =
    normalizedCoupon === ENROLLMENT_COUPON_CODE &&
    Date.now() <= ENROLLMENT_COUPON_EXPIRY.getTime();
  const couponDiscount = couponIsValid
    ? Math.round(
        (afterMultiCourseDiscount * ENROLLMENT_COUPON_DISCOUNT_PERCENT) / 100,
      )
    : 0;

  return Math.max(0, originalAmount - multiCourseDiscount - couponDiscount);
}
