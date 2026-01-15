# Phase 11: Performance Optimization - Implementation Plan

**Status**: 🚧 IN PROGRESS
**Priority**: HIGH
**Start Date**: January 15, 2026
**Target Completion**: 1-2 days

---

## 🎯 Objectives

Optimize the GoalGPT mobile app for:
- Faster load times and improved responsiveness
- Reduced memory footprint
- Smooth 60 FPS animations
- Smaller bundle size
- Better battery efficiency

---

## 📊 Current Performance Baseline

Based on Phase 10 metrics:
- **Bundle Size**: 2,119 modules (20.2s build time)
- **Memory Overhead**: ~3.5MB for analytics
- **Cold Start**: +20ms analytics overhead (negligible)
- **API Response Times**: Need profiling data
- **Screen Load Times**: Need profiling data

---

## 🎯 Performance Targets

| Metric | Current | Target | Priority |
|--------|---------|--------|----------|
| Bundle Size | 2119 modules | <1800 modules | HIGH |
| Cold Start | ~2-3s | <1.5s | MEDIUM |
| Screen Load | Unknown | <300ms | HIGH |
| Memory Usage | ~50MB | <40MB | MEDIUM |
| FPS | 55-60 | 60 stable | HIGH |
| API Latency | Unknown | <500ms | HIGH |

---

## 📦 Tasks Breakdown

### Task 1: Code Splitting & Lazy Loading ⚡
**Priority**: HIGH
**Estimated Impact**: 30-40% bundle size reduction

#### Sub-tasks:
- [ ] Implement React.lazy() for all screens
- [ ] Add Suspense boundaries with loading states
- [ ] Lazy load heavy dependencies (charts, animations)
- [ ] Split vendor bundles
- [ ] Measure bundle size reduction

#### Files to Optimize:
```
src/navigation/AppNavigator.tsx          # Lazy load all screens
src/screens/                             # Add React.lazy() to exports
src/components/admin/                    # Lazy load admin components
```

---

### Task 2: Image Optimization 🖼️
**Priority**: HIGH
**Estimated Impact**: Faster screen loads, reduced memory

#### Sub-tasks:
- [ ] Implement FastImage for network images
- [ ] Add image caching strategy
- [ ] Optimize image dimensions (no oversized images)
- [ ] Use WebP format where supported
- [ ] Implement progressive loading for images
- [ ] Add placeholder images

#### Files to Create/Modify:
```
src/components/OptimizedImage.tsx        # NEW: Optimized image component
src/components/MatchCard.tsx             # Replace Image with OptimizedImage
src/components/TeamCard.tsx              # Replace Image with OptimizedImage
src/screens/MatchDetailScreenContainer.tsx # Optimize images
```

---

### Task 3: List Performance 📜
**Priority**: HIGH
**Estimated Impact**: Smooth scrolling for large lists

#### Sub-tasks:
- [ ] Replace FlatList with FlashList where needed
- [ ] Implement proper keyExtractor
- [ ] Add getItemLayout for fixed-size items
- [ ] Optimize renderItem with React.memo
- [ ] Remove inline function definitions
- [ ] Implement virtualization for long lists

#### Files to Optimize:
```
src/screens/LiveMatchesScreen.tsx        # Large match lists
src/screens/predictions/PredictionsScreen.tsx # Prediction lists
src/screens/HomeScreen.tsx               # Multiple lists
src/components/MatchList.tsx             # Core list component
```

---

### Task 4: Re-render Optimization 🔄
**Priority**: MEDIUM
**Estimated Impact**: Reduced CPU usage, better FPS

#### Sub-tasks:
- [ ] Add React.memo to expensive components
- [ ] Use useMemo for expensive calculations
- [ ] Use useCallback for event handlers
- [ ] Implement shouldComponentUpdate where needed
- [ ] Profile and identify unnecessary re-renders
- [ ] Fix context re-render issues

#### Files to Optimize:
```
src/components/MatchCard.tsx             # Frequent re-renders
src/components/LiveMatchCard.tsx         # WebSocket updates
src/context/LivescoreContext.tsx         # Context optimization
src/context/AnalyticsContext.tsx         # Reduce re-renders
```

---

### Task 5: WebSocket Optimization 🔌
**Priority**: HIGH
**Estimated Impact**: Reduced network usage, better battery

#### Sub-tasks:
- [ ] Implement message batching
- [ ] Add reconnection backoff strategy
- [ ] Throttle high-frequency updates
- [ ] Unsubscribe from events when screens unmount
- [ ] Implement selective updates (only changed data)

#### Files to Optimize:
```
src/hooks/useSocket.ts                   # Core WebSocket hook
src/context/LivescoreContext.tsx         # WebSocket event handling
src/services/websocket.service.ts        # WebSocket client
```

---

### Task 6: API Call Optimization 🌐
**Priority**: HIGH
**Estimated Impact**: Faster data loading

#### Sub-tasks:
- [ ] Implement request caching
- [ ] Add request deduplication
- [ ] Implement stale-while-revalidate pattern
- [ ] Optimize parallel requests with Promise.all
- [ ] Add timeout handling
- [ ] Implement retry with exponential backoff

#### Files to Create/Modify:
```
src/services/api/cache.service.ts        # NEW: API cache layer
src/api/apiClient.ts                     # Add caching middleware
src/api/matches.ts                       # Implement caching
```

---

### Task 7: Memory Leak Prevention 🧠
**Priority**: MEDIUM
**Estimated Impact**: Stable memory usage over time

#### Sub-tasks:
- [ ] Audit all useEffect cleanup functions
- [ ] Fix event listener leaks
- [ ] Cleanup WebSocket subscriptions
- [ ] Clear timers and intervals
- [ ] Profile memory usage with React DevTools
- [ ] Add memory monitoring

#### Files to Audit:
```
src/hooks/useSocket.ts                   # WebSocket cleanup
src/context/LivescoreContext.tsx         # Event listeners
src/hooks/useScreenTracking.ts           # Analytics cleanup
src/services/analytics.service.ts        # Session cleanup
```

---

### Task 8: Bundle Size Analysis 📦
**Priority**: MEDIUM
**Estimated Impact**: Identify optimization opportunities

#### Sub-tasks:
- [ ] Generate bundle analysis report
- [ ] Identify large dependencies
- [ ] Replace heavy libraries with lighter alternatives
- [ ] Remove unused dependencies
- [ ] Tree-shake unused code

#### Commands:
```bash
npx expo export --platform ios --output-dir dist/ios
npx expo export --platform android --output-dir dist/android
# Analyze bundle sizes
```

---

### Task 9: Animation Performance 🎬
**Priority**: LOW
**Estimated Impact**: Smoother UI transitions

#### Sub-tasks:
- [ ] Use native driver for all animations
- [ ] Replace LayoutAnimation with Reanimated
- [ ] Optimize transform animations
- [ ] Reduce animation complexity
- [ ] Profile animation frame rates

#### Files to Optimize:
```
src/components/CustomTabBar.tsx          # Tab animations
src/navigation/AppNavigator.tsx          # Screen transitions
```

---

### Task 10: Database Query Optimization 💾
**Priority**: LOW (Backend)
**Estimated Impact**: Faster API responses

#### Sub-tasks:
- [ ] Add database indexes
- [ ] Optimize complex queries
- [ ] Implement query result caching
- [ ] Use database connection pooling
- [ ] Profile slow queries

**Note**: This is backend optimization, may be out of scope for mobile app phase.

---

## 🛠️ Tools & Libraries

### Performance Monitoring:
- React DevTools Profiler
- Expo Performance Monitor
- Flipper (for native debugging)
- React Native Performance Monitor

### New Dependencies:
```json
{
  "react-native-fast-image": "^8.6.3",      // Image caching
  "@shopify/flash-list": "^1.6.3",          // High-performance lists
  "react-native-reanimated": "^3.6.1",      // Smooth animations
  "react-native-mmkv": "^2.11.0"            // Fast local storage
}
```

---

## 📈 Success Metrics

### Before/After Comparison:
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Bundle Size | 2119 modules | TBD | TBD |
| Cold Start | ~2-3s | TBD | TBD |
| Home Screen Load | Unknown | TBD | TBD |
| Match List Scroll FPS | Unknown | TBD | TBD |
| Memory Usage | ~50MB | TBD | TBD |

### Testing Checklist:
- [ ] Cold start time < 1.5s
- [ ] All screens load < 300ms
- [ ] Smooth 60 FPS scrolling on all lists
- [ ] No memory leaks after 1 hour of use
- [ ] Bundle size reduced by 30%+
- [ ] API calls complete < 500ms

---

## 🚀 Implementation Order

1. **Day 1 Morning**: Code Splitting & Lazy Loading (Task 1)
2. **Day 1 Afternoon**: List Performance (Task 3)
3. **Day 2 Morning**: Image Optimization (Task 2)
4. **Day 2 Afternoon**: Re-render Optimization (Task 4)
5. **Day 2 Evening**: WebSocket & API Optimization (Tasks 5-6)
6. **Testing**: Memory Leak Prevention & Performance Testing (Tasks 7-8)

---

## ⚠️ Risks & Challenges

1. **Breaking Changes**: Lazy loading may break navigation if not tested thoroughly
2. **Library Compatibility**: FastImage/FlashList may have Expo Go limitations
3. **Over-optimization**: May increase code complexity
4. **Testing Overhead**: Performance testing requires real devices

---

## 📝 Notes

- Focus on high-impact optimizations first
- Measure before and after each optimization
- Use React DevTools Profiler extensively
- Test on real devices, not just simulator
- Keep backward compatibility in mind
- Don't sacrifice code readability for micro-optimizations

---

**Created**: January 15, 2026
**Author**: Claude Sonnet 4.5
