
export const epochToTimestamp = (epoch: number) => {
    return new Date(epoch * 1000)
}
export const getTimestamp = () => {
    return Math.floor(Date.now() / 1000)
}
export const toShortISODate = (date: Date): string => {
    return date.toISOString().slice(0, 10)
}
export function sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
export function getMonday( date: Date ) {
    var tempDate = structuredClone(date)
    var day = tempDate.getDay() || 7;  
    if( day !== 1 ) 
    tempDate.setHours(-24 * (day - 1)); 
    return tempDate;
}
  
export const getDateOffset = (startDate: Date, offset: number) => {
    let tempDate = structuredClone(startDate)
    tempDate.setDate(tempDate.getDate() + offset)
    return tempDate
}

export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}