---
name: screen-creation
description: GoalGPT'de yeni ekran oluşturma adımları, şablonu ve navigasyon bağlantısı
---

# GoalGPT Screen Creation Skill

## Ekran Klasör Yapısı
src/screens/
├── auth/         → Login, Register, Welcome
├── home/         → HomeScreen
├── live/         → LiveScreen
├── predictions/  → PredictionsScreen
└── profile/      → ProfileScreen, Settings, Favorites

## Yeni Ekran Şablonu
```tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';

interface NewScreenProps {
  // navigation props buraya
}

export const NewScreen: React.FC<NewScreenProps> = () => {
  const { colors, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    content: {
      padding: spacing.md,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* içerik */}
      </ScrollView>
    </SafeAreaView>
  );
};
```

## Navigasyon'a Ekleme Adımları

1. Ekranı oluştur → src/screens/kategori/YeniEkran.tsx
2. Navigator'a ekle → src/navigation/AppNavigator.tsx
3. Type tanımla → src/types/navigation.ts
4. Deep link ekle → src/config/linking.ts (gerekirse)

## Navigation Type Şablonu
```tsx
// src/types/navigation.ts'e ekle
export type RootStackParamList = {
  // mevcut ekranlar...
  YeniEkran: { id: string }; // parametreler varsa
};
```

## Navigasyon Stack'leri
- AuthStack → giriş yapmamış kullanıcı
- RootStack → giriş yapmış kullanıcı
- MainTabs → Home, Live, Predictions, Store, Profile
- Modal screens → MatchDetail, BotDetail, BlogDetail, DailyRewards

## Kurallar
- MUTLAKA SafeAreaView kullan
- ScrollView yoksa flex:1 container zorunlu
- Loading state → Skeleton component kullan
- Error state → ErrorState component kullan
- Her ekran kendi klasöründe olmalı
- 300 satırı geçen ekranlar → alt component'lere böl

## React Query Kullanımı
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['resource', id],
  queryFn: () => resourceApi.getById(id),
  staleTime: 30000,
});

if (isLoading) return <ScreenSkeleton />;
if (error) return <ErrorState onRetry={refetch} />;
```

## YASAK
- SafeAreaView olmadan ekran
- Hardcode padding/margin
- useEffect ile data fetch (React Query kullan)
- any type navigasyon params
