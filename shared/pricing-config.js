export const COURSE_PRICES = Object.freeze({
  "multi-cloud-live": 22000,
  "gcp-live": 14999,
  "gcp-recordings": 6999,
  "multi-cloud-recordings": 10999,
  "python-de": 599,
  "project-healthcare": 899,
  "project-retail": 899,
  "project-banking": 899,
  "project-traffic": 899,
});

export const MULTI_COURSE_DISCOUNT_PERCENT = 10;
export const MULTI_COURSE_MIN_COUNT = 2;
export const ENROLLMENT_COUPON_CODE = "SKILLVANE10";
export const ENROLLMENT_COUPON_DISCOUNT_PERCENT = 10;
export const ENROLLMENT_COUPON_START_DATE = "2026-09-24T00:00:00+05:30";
export const ENROLLMENT_COUPON_VALID_DAYS = 7;

export function getCouponExpiryDate() {
  const startDate = new Date(ENROLLMENT_COUPON_START_DATE);
  startDate.setDate(startDate.getDate() + ENROLLMENT_COUPON_VALID_DAYS);
  return startDate;
}
