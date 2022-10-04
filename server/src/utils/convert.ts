// 10:00 -> 1000

export function convert(hourString: string) {
    const [hours, minutes] = hourString.split(':').map(Number)

    const minutesAmounts = (hours * 60) + minutes;

    return minutesAmounts;
}