import { ActivityData } from "./types"

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
export const intensityMETWeights = {
    softActivity: 1.75,
    moderateActivity: 3,
    intenseActivity: 5.5
}

export const calcActivity = (activityData: ActivityData) => {
    const METDone = Math.floor(
        ((activityData.softActivity / 60) * intensityMETWeights.softActivity) +
        ((activityData.moderateActivity / 60) * intensityMETWeights.moderateActivity) +
        ((activityData.intenseActivity / 60) * intensityMETWeights.intenseActivity)
    )
    return METDone
}

export function getDateDiffInDays(a: Date, b: Date) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  export const getScoreEmoji = (score: number) => {
    const scorePointsToEmoji: any = {
        30: "😡",
        55: "😐",
        70: "🙂",
        85: "😊",
        100: "😍"
    }
    const thresholds = Object.keys(scorePointsToEmoji)
    for (let i = 0; i < thresholds.length; i++) {
        const threshold = Number(thresholds[i])
        if (score <= threshold) {
            return scorePointsToEmoji[threshold]
        }
    }
    return scorePointsToEmoji[thresholds[thresholds.length - 1]]

}


export const getActivityVolumeString = (curDate: string, activitySinceMonday: ActivityData[], weeklyActivityGoal: number) => {

    const activityDonePastWeek = activitySinceMonday.map((curElement) => {
        return calcActivity(curElement)
    })
    const activityUntilToday = activityDonePastWeek.reduce((accum, curElem, idx) => {
        if (idx === activityDonePastWeek.length - 1) {
            return accum
        }
        return accum + curElem
    })

    console.log(activityDonePastWeek)

    const METToday = activityDonePastWeek[activityDonePastWeek.length - 1]

    const METRemaining = weeklyActivityGoal - activityUntilToday - METToday
    if (METRemaining > 0) {
        const remainingBeforeToday = weeklyActivityGoal - activityUntilToday
        const expectedRateBefore = Math.floor(remainingBeforeToday / (7 - activityDonePastWeek.length + 1))

        const remainingDays = 7 - activityDonePastWeek.length
        const averageInFuture = Math.floor(METRemaining / remainingDays)
        const percentage = Math.floor((METToday / expectedRateBefore) * 100)

        const todayFeedback = `${METToday}/${expectedRateBefore} MET Minutes - ${percentage}% - ${getScoreEmoji(percentage)}`
        let activityString = `${todayFeedback}
Remaining activity for this week:  ${METRemaining} MET mins
You should aim to do ${averageInFuture} MET mins per day to achieve the goal`

        return activityString
    }
    else {
        const todayFeedback = `${METToday} MET mins - ${getScoreEmoji(100)}`
        let activityString = `${todayFeedback}
+${activityUntilToday + METToday - weeklyActivityGoal} MET mins Over the goal`
        return activityString
    }

}

export const getActivityBody = (curDate: string, activitySinceMonday: ActivityData[], weeklyActivityGoal: number) => {

    const reportBody = `🏃 Activity: ${getActivityVolumeString(curDate, activitySinceMonday, weeklyActivityGoal)}
    `
    return reportBody
}