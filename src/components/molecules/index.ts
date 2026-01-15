/**
 * Molecules - Composite Components
 * Built from atomic components to create functional UI pieces
 */

// ScoreDisplay
export {
  ScoreDisplay,
  LiveScoreDisplay,
  FinalScoreDisplay,
  CompactScoreDisplay,
} from './ScoreDisplay';
export type { ScoreDisplayProps } from './ScoreDisplay';

// TeamBadge
export { TeamBadge, CompactTeamBadge, VerticalTeamBadge, TeamBadgeWithForm } from './TeamBadge';
export type { TeamBadgeProps, TeamBadgeLayout, TeamBadgeSize } from './TeamBadge';

// LiveTicker
export {
  LiveTicker,
  CompactLiveTicker,
  HalfTimeTicker,
  PenaltiesTicker,
  FirstHalfTicker,
  SecondHalfTicker,
} from './LiveTicker';
export type { LiveTickerProps, MatchPeriod } from './LiveTicker';

// LeagueHeader
export { LeagueHeader, CompactLeagueHeader, LeagueHeaderWithSeparator } from './LeagueHeader';
export type { LeagueHeaderProps } from './LeagueHeader';

// MatchCard
export {
  MatchCard,
  LiveMatchCard,
  UpcomingMatchCard,
  EndedMatchCard,
  CompactMatchCard,
} from './MatchCard';
export type { MatchCardProps, MatchStatus, Team } from './MatchCard';
