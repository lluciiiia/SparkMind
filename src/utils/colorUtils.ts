export const colors = [
    "#f6ecc9", // light peach
    "#9ab2d4", // light blue
    "#f6c3ae", // light coral
    "#aad59f", // light green
    "#fdd849", // yellow
    "#cdbcdc"  // light gray
];

export function shuffleArray(array: any[]): any[] {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}