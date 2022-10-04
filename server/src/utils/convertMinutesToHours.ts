// 1100 -> 18:20

export function convertMinutesToHours(minutesAmounts: number){
    const hours = Math.floor(minutesAmounts / 60);
    const minutes = minutesAmounts % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}