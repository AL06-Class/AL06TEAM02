export const pricingProducts = [
  {
    id: "premium-banner",
    audience: "company",
    placement: "사이트 메인",
    name: "프리미엄배너",
    description: "메인 최상단 프리미엄 배너 출력",
    prices: [
      { label: "1개월", amount: 69000 },
      { label: "3개월", amount: 155000 },
      { label: "1년", amount: 550000 },
    ],
  },
  {
    id: "auto-jump",
    audience: "company",
    placement: "자동점프",
    name: "촬영자 모집 자동점프",
    description: "24시간 단위로 리스트 최상단 출력",
    prices: [
      { label: "10건", amount: 16500 },
      { label: "30건", amount: 33000 },
      { label: "100건", amount: 66000 },
    ],
  },
  {
    id: "contact-pass",
    audience: "company",
    placement: "프로필 열람",
    name: "촬영자 연락처 열람",
    description: "결제기간 동안 연락처 상세 열람, 제안 메일 가능",
    prices: [
      { label: "1일", amount: 6900 },
      { label: "1주", amount: 27000 },
      { label: "3개월", amount: 169000 },
    ],
  },
  {
    id: "recommended-profile",
    audience: "personal",
    placement: "프로필 리스트/메인",
    name: "추천 촬영자 프로필",
    description: "메인 화면에 프로필 노출",
    prices: [
      { label: "1개월", amount: 25000 },
    ],
  },
] as const;
