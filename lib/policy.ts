export const CONTACT_PASS_VALIDITY_HOURS = 24;
export const AUTO_JUMP_CYCLE_HOURS = 24;
export const AUTO_JUMP_LIMIT_PER_JOB_PER_DAY = 1;
export const PORTFOLIO_UPLOAD_LIMIT_MB = 10;
export const PORTFOLIO_UPLOAD_LIMIT_BYTES = PORTFOLIO_UPLOAD_LIMIT_MB * 1024 * 1024;

export const COMPANY_VERIFY_REJECTION_REASONS = [
  "기한 초과",
  "정보 불일치",
  "판독 불가",
  "기타",
] as const;
