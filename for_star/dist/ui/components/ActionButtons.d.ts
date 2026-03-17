import React from 'react';
interface ActionButtonsProps {
    canCheck: boolean;
    canCall: boolean;
    canRaise: boolean;
    minRaise: number;
    maxRaise: number;
    toCall: number;
}
export declare const ActionButtons: React.FC<ActionButtonsProps>;
export {};
