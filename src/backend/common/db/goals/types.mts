export const enum GoalType {
    STEPS = 'steps',
    ACTIVITY = 'activity',
    SLEEP_DURATION = 'sleepDuration',
    SLEEP_DEPTH = 'sleepDepth'
}

export interface Goal{
    Type: GoalType,
    Value: number
}