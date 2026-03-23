---
name: component
description: GoalGPT Atomic Design component yazım kuralları ve şablonları
---

# GoalGPT Component Skill

## Atomic Design Yapısı
src/components/
├── atoms/       → Tek başına anlam taşıyan en küçük parça (NeonText, Badge, Avatar)
├── molecules/   → 2-3 atom birleşimi (MatchCard, PredictionCard, TeamBadge)
├── organisms/   → Kompleks, bağımsız bölümler (BlogSlider, LeaderboardList)
├── ui/          → Genel amaçlı temel bileşenler (Button, Input, Card, Spinner)
└── skeletons/   → Loading placeholder'ları

## Component Şablonu (zorunlu format)
```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ComponentNameProps {
  // prop tanımları buraya
}

export const ComponentName: React.FC<ComponentNameProps> = ({ }) => {
  const { colors, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background.secondary,
      padding: spacing.md,
    },
  });

  return (
    <View style={styles.container}>
      {/* içerik */}
    </View>
  );
};
```

## Kurallar
- Her component kendi klasöründe index.ts ile export edilir
- Props interface'i MUTLAKA tanımla, any kullanma
- StyleSheet DAIMA component içinde useTheme ile oluştur
- Hardcode renk, hardcode spacing YASAK
- Component 150 satırı geçiyorsa böl
- Loading state için skeleton component kullan
- Her zaman accessible={true} ve accessibilityLabel ekle

## Naming
- Component dosyası: PascalCase → MatchCard.tsx
- Klasör: camelCase → matchCard/
- Export: named export, default export KULLANMA

## Mevcut UI Componentler
- Button: variant = primary | secondary | ghost | danger, size = small | medium | large
- GlassCard: intensity = light | medium | intense
- NeonText: color = brand | white | muted, pulse = boolean
- Spinner: size = small | medium | large
- Input: variant = default | search | password

## YASAK
- any type kullanımı
- Default export
- Hardcode style değerleri
- useTheme dışından renk almak
