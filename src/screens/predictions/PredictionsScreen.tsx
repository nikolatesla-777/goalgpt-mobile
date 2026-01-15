import React from 'react';
import BotListScreen from '../BotListScreen';
import type { Bot } from '../../services/bots.service';

// ============================================================================
// TYPES
// ============================================================================

export interface PredictionsScreenProps {
  onBotPress?: (botId: number) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function PredictionsScreen({ onBotPress }: PredictionsScreenProps) {
  const handleBotPress = (bot: Bot) => {
    console.log('Bot pressed:', bot.name, bot.id);
    // Navigate to bot detail screen
    onBotPress?.(bot.id);
  };

  return <BotListScreen onBotPress={handleBotPress} />;
}
