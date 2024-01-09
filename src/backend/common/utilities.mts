
export const epochToTimestamp = (epoch: number) => {
    return new Date(epoch * 1000)
}
export const getTimestamp = () => {
    return Math.floor(Date.now() / 1000)
}