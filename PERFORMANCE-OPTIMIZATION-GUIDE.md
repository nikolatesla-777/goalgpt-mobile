# Performance Optimization Guide

## Overview

This guide documents all performance optimization patterns, utilities, and best practices implemented in the GoalGPT mobile app.

---

## Table of Contents

1. [Image Optimization](#image-optimization)
2. [List Optimization](#list-optimization)
3. [Code Splitting & Lazy Loading](#code-splitting--lazy-loading)
4. [Memoization](#memoization)
5. [Re-render Optimization](#re-render-optimization)
6. [Performance Monitoring](#performance-monitoring)
7. [Best Practices](#best-practices)

---

## Image Optimization

### OptimizedImage Component

Use `OptimizedImage` instead of React Native's `Image` component for better performance.

```typescript
import { OptimizedImage, TeamLogoImage, NewsImage } from '@/components/atoms/OptimizedImage';

// Basic usage
<OptimizedImage
  source="https://example.com/image.jpg"
  style={{ width: 100, height: 100 }}
  showLoading={true}
  cachePolicy="memory-disk"
/>

// Team logo (with fallback)
<TeamLogoImage
  source={team.logo}
  style={{ width: 40, height: 40 }}
/>

// News image (with blur placeholder)
<NewsImage
  source={article.image}
  style={{ width: '100%', height: 200 }}
/>
```

**Benefits:**
- Automatic caching (memory + disk)
- Progressive loading with blur placeholder
- Automatic fallback images
- Error handling
- Loading indicators

---

## List Optimization

### OptimizedFlatList Component

Use `OptimizedFlatList` for rendering large lists efficiently.

```typescript
import { OptimizedFlatList } from '@/components/atoms/OptimizedFlatList';

<OptimizedFlatList
  data={matches}
  renderItem={(match, index) => <MatchCard match={match} />}
  keyExtractor={(match) => match.id.toString()}
  itemHeight={100} // IMPORTANT: Specify if items have consistent height
  emptyMessage="No matches found"
  loading={isLoading}
  showSeparator={true}
/>
```

**Optimizations Applied:**
- `removeClippedSubviews={true}` - Unmounts off-screen components
- `maxToRenderPerBatch={10}` - Limits items rendered per batch
- `windowSize={5}` - Keeps 5 screen heights in memory
- `getItemLayout` - Pre-calculated positions for consistent heights

---

## Code Splitting & Lazy Loading

### Lazy Loading Screens

Use `createLazyComponent` for heavy screens that aren't immediately needed.

```typescript
import { createLazyComponent } from '@/components/atoms/LazyLoadWrapper';

// Lazy load match detail screen
const MatchDetailScreen = createLazyComponent(
  () => import('./app/match/[id]'),
  {
    minLoadingTime: 300, // Prevent loading flash
  }
);

// Usage in router
<Stack.Screen name="match/[id]" component={MatchDetailScreen} />
```

### Manual Lazy Loading

```typescript
import React, { Suspense } from 'react';
import { LazyLoadWrapper, LoadingFallback } from '@/components/atoms/LazyLoadWrapper';

const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function MyScreen() {
  return (
    <LazyLoadWrapper fallback={<LoadingFallback fullScreen />}>
      <HeavyComponent />
    </LazyLoadWrapper>
  );
}
```

### Preloading

Preload components on user interaction:

```typescript
import { preloadLazyComponent } from '@/components/atoms/LazyLoadWrapper';

// Preload on button hover/press
<Pressable
  onPressIn={() => preloadLazyComponent(() => import('./HeavyScreen'))}
  onPress={() => navigate('HeavyScreen')}
>
  <Text>Go to Heavy Screen</Text>
</Pressable>
```

---

## Memoization

### Memoize Expensive Computations

```typescript
import { memoize, memoizeCalculation, memoizeArrayOperation } from '@/utils/memoization';

// Memoize array filtering
const filterLiveMatches = memoizeArrayOperation((matches) => {
  return matches.filter(m => m.status_id === 2);
});

// Memoize calculations
const calculateScore = memoizeCalculation((home, away) => {
  return `${home} - ${away}`;
});

// Custom memoization
const expensiveFunction = memoize(
  (param1, param2) => {
    // Expensive computation
    return result;
  },
  {
    keyResolver: (p1, p2) => `${p1}-${p2}`,
    maxSize: 100,
    ttl: 60000, // 1 minute
  }
);
```

### Async Memoization

```typescript
import { memoizeAsync } from '@/utils/memoization';

const fetchTeamData = memoizeAsync(
  async (teamId) => {
    const response = await apiClient.get(`/teams/${teamId}`);
    return response.data;
  },
  {
    ttl: 300000, // 5 minutes
  }
);
```

---

## Re-render Optimization

### React.memo

Wrap functional components to prevent unnecessary re-renders:

```typescript
import React from 'react';

const MatchCard = React.memo(({ match }) => {
  return (
    <View>
      <Text>{match.homeTeam} vs {match.awayTeam}</Text>
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  // Return true if props are equal (no re-render needed)
  return prevProps.match.id === nextProps.match.id &&
         prevProps.match.home_scores === nextProps.match.home_scores &&
         prevProps.match.away_scores === nextProps.match.away_scores;
});

export default MatchCard;
```

### useMemo Hook

Memoize expensive computations within components:

```typescript
import { useMemo } from 'react';

function MatchList({ matches }) {
  // Only recalculate when matches change
  const liveMatches = useMemo(() => {
    return matches.filter(m => m.status_id === 2);
  }, [matches]);

  const matchStats = useMemo(() => {
    return {
      total: matches.length,
      live: liveMatches.length,
      finished: matches.filter(m => m.status_id === 8).length,
    };
  }, [matches, liveMatches]);

  return (
    <View>
      <Text>Live: {matchStats.live}</Text>
      <FlatList data={liveMatches} renderItem={...} />
    </View>
  );
}
```

### useCallback Hook

Memoize callback functions to prevent child re-renders:

```typescript
import { useCallback } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState('');

  // Without useCallback, this creates a new function on every render
  // causing ChildComponent to re-render even when count doesn't change
  const handleClick = useCallback(() => {
    console.log('Clicked', count);
  }, [count]); // Only recreate when count changes

  return (
    <>
      <ChildComponent onPress={handleClick} />
      <TextInput value={other} onChangeText={setOther} />
    </>
  );
}

const ChildComponent = React.memo(({ onPress }) => {
  return <Pressable onPress={onPress}><Text>Click</Text></Pressable>;
});
```

---

## Performance Monitoring

### Track Component Render Performance

```typescript
import { useRenderPerformance, useWhyDidYouUpdate, useRenderCount } from '@/utils/performance';

function MyComponent({ prop1, prop2 }) {
  // Track render time
  useRenderPerformance('MyComponent');

  // Debug why component re-rendered
  useWhyDidYouUpdate('MyComponent', { prop1, prop2 });

  // Count renders
  const renderCount = useRenderCount('MyComponent');

  return <View>...</View>;
}
```

### Measure Execution Time

```typescript
import { measureTime, measureTimeAsync } from '@/utils/performance';

// Synchronous
const result = measureTime('expensiveCalculation', () => {
  return matches.filter(...).map(...).reduce(...);
});

// Asynchronous
const data = await measureTimeAsync('fetchData', async () => {
  return await apiClient.get('/matches');
});
```

### Performance Marks

```typescript
import { mark, measure } from '@/utils/performance';

// Mark start
mark('screen-load-start');

// ... do work ...

// Mark end
mark('screen-load-end');

// Measure duration
measure('screen-load-time', 'screen-load-start', 'screen-load-end');
```

### Memory Monitoring

```typescript
import { logMemoryUsage } from '@/utils/performance';

// Log current memory usage
logMemoryUsage();
// Output: 💾 Memory: 45.23MB / 60.50MB (Limit: 512.00MB)
```

### Performance Report

```typescript
import { performanceTracker } from '@/utils/performance';

// Print performance report for all components
performanceTracker.printReport();

/*
Output:
📊 Performance Report

Component                      Renders  Avg Time   Last Time
======================================================================
MatchDetailScreen              12       45.23ms    42.11ms
MatchList                      25       12.45ms    11.89ms
MatchCard                      180      3.21ms     3.18ms
*/
```

---

## Best Practices

### 1. Image Optimization

✅ **DO:**
- Use `OptimizedImage` for all images
- Specify image dimensions to prevent layout shifts
- Use appropriate cache policies
- Provide fallback images

❌ **DON'T:**
- Use React Native's `<Image>` directly
- Load full-size images when thumbnails suffice
- Forget to handle loading/error states

### 2. List Rendering

✅ **DO:**
- Use `OptimizedFlatList` for lists
- Specify `itemHeight` for consistent heights
- Use `keyExtractor` for stable keys
- Extract list items to separate memoized components

❌ **DON'T:**
- Use `.map()` for large lists (use FlatList)
- Create inline functions in `renderItem`
- Use array index as key
- Render complex components inline

### 3. Code Splitting

✅ **DO:**
- Lazy load screens not needed immediately
- Preload on user interaction
- Use `minLoadingTime` to prevent flashing
- Provide meaningful loading fallbacks

❌ **DON'T:**
- Lazy load small/critical components
- Over-split causing many small chunks
- Forget to handle loading states

### 4. Memoization

✅ **DO:**
- Memoize expensive calculations
- Use appropriate TTL values
- Clear caches when needed
- Memoize list transformations

❌ **DON'T:**
- Memoize cheap operations (overhead > benefit)
- Use infinite TTL for dynamic data
- Forget to handle cache invalidation

### 5. Re-render Optimization

✅ **DO:**
- Wrap list items with `React.memo`
- Use `useCallback` for callbacks passed to children
- Use `useMemo` for expensive computations
- Provide custom comparison functions when needed

❌ **DON'T:**
- Wrap every component with `React.memo`
- Memoize everything (adds overhead)
- Forget dependencies in hooks

### 6. Performance Monitoring

✅ **DO:**
- Use performance hooks during development
- Monitor slow renders (>16ms)
- Track render counts
- Profile before optimizing

❌ **DON'T:**
- Leave performance hooks in production
- Optimize without measuring
- Ignore performance warnings

---

## Performance Checklist

Use this checklist when building new features:

- [ ] Images use `OptimizedImage`
- [ ] Lists use `OptimizedFlatList`
- [ ] Heavy screens are lazy loaded
- [ ] Expensive computations are memoized
- [ ] List items are memoized with `React.memo`
- [ ] Callbacks use `useCallback`
- [ ] Expensive calculations use `useMemo`
- [ ] Performance monitored during development
- [ ] No unnecessary re-renders
- [ ] Smooth 60fps scrolling

---

## Measuring Success

### Target Metrics

- **Initial Load Time:** <2 seconds
- **Screen Navigation:** <100ms
- **List Scrolling:** 60fps (16ms per frame)
- **Memory Usage:** <150MB
- **Bundle Size:** <5MB

### Tools

1. **React DevTools Profiler** - Measure component render times
2. **Performance Monitor** - Track FPS and memory
3. **Bundle Analyzer** - Analyze bundle size
4. **Custom Hooks** - `useRenderPerformance`, `useWhyDidYouUpdate`

---

## Troubleshooting

### Slow Renders

**Symptom:** Component takes >16ms to render

**Solutions:**
1. Use `useWhyDidYouUpdate` to find unnecessary re-renders
2. Wrap component with `React.memo`
3. Move expensive logic to `useMemo`
4. Consider code splitting

### Memory Leaks

**Symptom:** Memory usage keeps increasing

**Solutions:**
1. Check for uncleaned subscriptions/timers
2. Clear caches periodically
3. Use `useMountEffect` to track component lifecycle
4. Monitor with `logMemoryUsage()`

### Jittery Scrolling

**Symptom:** FlatList scrolling is not smooth

**Solutions:**
1. Use `OptimizedFlatList` with `itemHeight`
2. Memoize list item components
3. Remove heavy operations from render
4. Use `removeClippedSubviews`

---

## Additional Resources

- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [React Native Performance](https://reactnative.dev/docs/performance)
- [Expo Image Documentation](https://docs.expo.dev/versions/latest/sdk/image/)
- [FlatList Optimization](https://reactnative.dev/docs/optimizing-flatlist-configuration)

---

**Last Updated:** January 13, 2026
**Version:** 1.0
