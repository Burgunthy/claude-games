import React from 'react';
import { Card, Player, GamePhase } from '../../core/types.js';
interface TableProps {
    players: Player[];
    communityCards: Card[];
    pot: number;
    phase: GamePhase;
    currentPlayerIndex: number;
    dealerIndex: number;
    showCards?: boolean;
}
export declare const Table: React.FC<TableProps>;
export {};
