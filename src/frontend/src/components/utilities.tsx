
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
  