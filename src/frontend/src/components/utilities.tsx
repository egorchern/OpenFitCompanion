
export const toShortISODate = (date: Date): string => {
    return date.toISOString().slice(0, 10)
}

export const getDateOffset = (startDate: Date, offset: number) => {
    let tempDate = structuredClone(startDate)
    tempDate.setDate(tempDate.getDate() + offset)
    return tempDate
}
export function getMonday( date: Date ) {
    var tempDate = structuredClone(date)
    var day = tempDate.getDay() || 7;  
    if( day !== 1 ) 
    tempDate.setHours(-24 * (day - 1)); 
    return tempDate;
}

export function getDateDiffInDays(a: Date, b: Date) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }