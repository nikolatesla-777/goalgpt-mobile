---
name: figma-to-code
description: GoalGPT Figma tasarımlarını React Native koduna dönüştürme kuralları ve süreci
---

# GoalGPT Figma-to-Code Skill

## Figma Proje Bilgisi
- Proje: GoalGPT Project (300925)
- Erişim: Figma MCP bağlantısı ile
- Brand font: Nohemi (assets/fonts/)

## Dönüştürme Süreci

### Adım 1 — Figma'dan Ölçüleri Al
- Frame boyutları → width/height
- Padding/margin → spacing token'larına çevir
- Border radius → theme.borderRadius token'larına çevir
- Renkleri → theme.colors token'larına çevir (hardcode YAZMA)

### Adım 2 — Spacing Eşleştirme (8pt grid)
Figma px  →  Token
4px       →  spacing.xs
8px       →  spacing.sm
16px      →  spacing.md
24px      →  spacing.lg
32px      →  spacing.xl

### Adım 3 — Renk Eşleştirme
Figma rengi      →  Token
#4BC41E          →  colors.primary (dark) / colors.primaryLight (light)
#0A0A0A          →  colors.background.primary
#1A1A1A          →  colors.background.secondary
#FFFFFF          →  colors.text.primary
#B3B3B3          →  colors.text.secondary

### Adım 4 — Tipografi Eşleştirme
Figma            →  React Native
Nohemi Bold 24   →  fontFamily: 'Nohemi-Bold', fontSize: 24
Nohemi Medium 16 →  fontFamily: 'Nohemi-Medium', fontSize: 16
Nohemi Regular 14→  fontFamily: 'Nohemi-Regular', fontSize: 14

### Adım 5 — Component Seç
Figma elementi   →  React Native component
Dikdörtgen       →  View
Metin            →  Text
Resim            →  expo-image (Image değil)
Liste            →  FlatList (ScrollView değil)
Buton            →  ui/Button component
Kart             →  ui/GlassCard component
Input            →  ui/Input component

## Glassmorphism Efekti
```tsx
// Figma'da blur/glass efekti görürsen:
import { GlassCard } from '@/components/ui/GlassCard';

<GlassCard intensity="intense">
  {/* içerik */}
</GlassCard>

// Manuel yazmak gerekirse:
import { BlurView } from 'expo-blur';
<BlurView intensity={20} tint={isDark ? 'dark' : 'light'}>
  {/* içerik */}
</BlurView>
```

## Neon/Glow Efekti
```tsx
// Figma'da neon metin görürsen:
import { NeonText } from '@/components/atoms/NeonText';

<NeonText color="brand" pulse={isLive}>
  LIVE
</NeonText>
```

## Shadow (iOS/Android Farkı)
```tsx
// iOS shadow
shadowColor: colors.primary,
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.3,
shadowRadius: 8,

// Android shadow
elevation: 8,

// Her ikisi için:
...Platform.select({
  ios: { shadowColor, shadowOffset, shadowOpacity, shadowRadius },
  android: { elevation: 8 },
})
```

## Responsive Boyutlar
```tsx
import { Dimensions } from 'react-native';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Figma 390px genişlikte tasarlandıysa:
const scale = SCREEN_WIDTH / 390;
const scaledSize = (size: number) => size * scale;
```

## Animasyon (Figma prototype → kod)
```tsx
// Figma fade in → Reanimated
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

<Animated.View entering={FadeIn.duration(300)}>
  {/* içerik */}
</Animated.View>

// Press efekti
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
const scale = useSharedValue(1);
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));
```

## Eksik Tasarım Durumu
Figma'da olmayan bir ekran veya component gerekiyorsa:
1. Mevcut ekranların stilini referans al
2. GoalGPT design language'ını koru:
   - OLED siyah arka plan (dark mode)
   - Neon yeşil (#4BC41E) accent
   - Glassmorphism kartlar
   - Nohemi font ailesi
3. Atomic Design pattern'ine uy

## YASAK
- Figma px değerlerini direkt hardcode yazma
- Platform.OS === 'ios' ile renk farklılaştırma
- expo-image yerine Image kullanma
- Figma'daki her pixel'i birebir kopyalamaya çalışma
  (responsive olması şart)
