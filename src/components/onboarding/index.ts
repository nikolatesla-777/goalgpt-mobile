/**
 * Onboarding Components
 * Export all onboarding related components and data
 */

// ============================================================================
// ONBOARDING DATA
// ============================================================================

import { OnboardingSlideData } from './OnboardingSlide';

export { OnboardingSlide } from './OnboardingSlide';
export type { OnboardingSlideData, OnboardingSlideProps } from './OnboardingSlide';

export { OnboardingDots } from './OnboardingDots';
export type { OnboardingDotsProps } from './OnboardingDots';

export const ONBOARDING_SLIDES: OnboardingSlideData[] = [
  {
    id: 1,
    title: 'Hoş Geldiniz!',
    description:
      'GoalGPT ile futbol dünyasını keşfedin. Canlı skorlar, detaylı istatistikler ve yapay zeka destekli tahminler sizleri bekliyor.',
    icon: '⚽',
    accentColor: 'primary',
  },
  {
    id: 2,
    title: 'Canlı Maç Takibi',
    description:
      'Tüm liglerdeki maçları canlı takip edin. Anlık skor güncellemeleri, detaylı istatistikler ve dakika dakika gelişmeler.',
    icon: '📊',
    accentColor: 'success',
  },
  {
    id: 3,
    title: 'AI Destekli Tahminler',
    description:
      'Yapay zeka algoritmaları ile oluşturulan maç tahminlerine erişin. Geçmiş verilere dayalı akıllı analizler.',
    icon: '🤖',
    accentColor: 'warning',
  },
  {
    id: 4,
    title: 'Detaylı İstatistikler',
    description:
      'Takım performansları, oyuncu istatistikleri, lig sıralamaları ve daha fazlası. Her şey parmaklarınızın ucunda.',
    icon: '📈',
    accentColor: 'primary',
  },
  {
    id: 5,
    title: 'Hadi Başlayalım!',
    description:
      'Futbol deneyiminizi bir üst seviyeye taşımaya hazır mısınız? Hemen giriş yapın ve keşfetmeye başlayın.',
    icon: '🚀',
    accentColor: 'success',
  },
];
