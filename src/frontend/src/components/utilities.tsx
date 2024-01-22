
export const toShortISODate = (date: Date): string => {
    return date.toISOString().slice(0, 10)
}

export const getDateOffset = (startDate: Date, offset: number) => {
    let tempDate = structuredClone(startDate)
    tempDate.setDate(tempDate.getDate() + offset)
    return tempDate
}