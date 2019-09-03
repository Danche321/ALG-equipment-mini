export function checkPhone(val) {
  return /^1[3456789]\d{9}$/.test(val)
}