// utils/assignColors.ts
import { colors, shuffleArray } from './colorUtils';

export const assignColors = (cards: any[], existingColorMap: Map<number, string>): Map<number, string> => {
    const colorMap = new Map<number, string>(existingColorMap);
    const shuffledColors = shuffleArray([...colors]);

    cards.forEach((card, idx) => {
        if (!colorMap.has(card.index)) {
            let color = shuffledColors[idx % shuffledColors.length];
            // Ensure no adjacent cards have the same color
            if (idx > 0 && color === colorMap.get(cards[idx - 1].index)) {
                color = shuffledColors[(idx + 1) % shuffledColors.length];
            }
            colorMap.set(card.index, color);
        }
    });

    return colorMap;
};
