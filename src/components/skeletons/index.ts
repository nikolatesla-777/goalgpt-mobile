/**
 * Skeletons Module Index
 * 
 * Exports all skeleton loading components
 * 
 * @module components/skeletons
 */

export { HomeSkeleton } from './HomeSkeleton';

// Re-export from atoms for convenience
export {
    Skeleton,
    SkeletonMatchCard,
    SkeletonPredictionCard
} from '../atoms/Skeleton';

// Re-export specialized skeletons
export { LiveMatchCardSkeleton } from '../live-scores/LiveMatchCardSkeleton';
export { ProfileHeaderSkeleton } from '../profile/ProfileHeaderSkeleton';
