/**
 * Templates - Layout and State Components
 * High-level templates for consistent screen structure and states
 */

// ScreenLayout
export {
  ScreenLayout,
  FixedScreenLayout,
  PaddedScreenLayout,
  CompactScreenLayout,
  NoPaddingScreenLayout,
} from './ScreenLayout';
export type { ScreenLayoutProps } from './ScreenLayout';

// EmptyState
export {
  EmptyState,
  NoMatchesFound,
  NoResultsFound,
  NoDataAvailable,
  ComingSoon,
  UnderMaintenance,
} from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

// LoadingState
export {
  LoadingState,
  LoadingSpinner,
  MatchCardSkeleton,
  ListSkeleton,
  ContentSkeleton,
} from './LoadingState';
export type { LoadingStateProps } from './LoadingState';

// ErrorState
export {
  ErrorState,
  NetworkError,
  ServerError,
  NotFoundError,
  UnauthorizedError,
  GenericError,
} from './ErrorState';
export type { ErrorStateProps, ErrorType } from './ErrorState';

// RefreshableScrollView
export { RefreshableScrollView, useRefresh } from './RefreshableScrollView';
export type { RefreshableScrollViewProps } from './RefreshableScrollView';
