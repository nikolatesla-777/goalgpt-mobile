---
name: theme-ui
description: GoalGPT tema sistemi, light/dark mode token'ları ve renk kullanım kuralları
---

# GoalGPT Theme & UI Skill

## Tema Dosyası
src/constants/theme.ts

## Renk Token'ları

### Brand
- PRIMARY: '#4BC41E' (Neon Green — sadece dark mode'da kullan)
- PRIMARY_LIGHT: '#2E7D1F' (WCAG AA uyumlu — light mode'da kullan)

### Dark Theme (varsayılan)
- background.primary: '#0A0A0A'
- background.secondary: '#1A1A1A'
- background.tertiary: '#242424'
- text.primary: '#FFFFFF'
- text.secondary: '#B3B3B3'
- text.brand: '#4BC41E'

### Light Theme
- background.primary: '#FFFFFF'
- background.secondary: '#F5F5F5'
- background.tertiary: '#EBEBEB'
- text.primary: '#000000'
- text.secondary: '#4D4D4D'
- text.brand: '#2E7D1F' ← WCAG AA zorunlu, '#4BC41E' KULLANMA

## Kurallar
- Renkleri ASLA hardcode yazma: '#4BC41E' yerine colors.primary kullan
- Her zaman ThemeContext'ten renkleri al: const { colors } = useTheme()
- Light mode'da brand rengi için MUTLAKA PRIMARY_LIGHT kullan
- Spacing: xs=4, sm=8, md=16, lg=24, xl=32 (8pt grid)
- Border radius: sm=8, md=12, lg=16, xl=24

## useTheme Kullanımı
```tsx
const { colors, spacing, isDark } = useTheme();

<View style={{
  backgroundColor: colors.background.primary,
  padding: spacing.md
}}>
  <Text style={{ color: colors.text.primary }}>
    İçerik
  </Text>
</View>
```

## YASAK
- StyleSheet içinde hardcode renk
- isDark ? '#fff' : '#000' pattern'i (token kullan)
- Light mode'da text.brand için '#4BC41E'
