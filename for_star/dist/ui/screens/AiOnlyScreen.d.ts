import React from 'react';
import { GameConfig } from '../../core/types.js';
interface AiOnlyScreenProps {
    config: GameConfig;
    onExit: () => void;
}
export declare const AiOnlyScreen: React.FC<AiOnlyScreenProps>;
export {};
