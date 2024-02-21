import React, { useMemo, useState } from 'react';
import DataGraph from '../../components/dataGraph';
import { ActivityData, HealthDataType, SleepData, readableActivityData, readableSleepData } from '../../components/types';

import { getDateOffset, toShortISODate } from '../../components/utilities';
import Button from '@mui/material/Button';
import { QueryHealthData } from '../../hooks/queryHealthData';
const PAST_DAYS_N = 7
export default function DataVisualiser() {
    const [curPropertyName, setCurPropertyName] = useState("");
    const [curDataType, setCurDataType] = useState(HealthDataType.Sleep)
    const sleepPropertyNames = useMemo(() => {

        return Object.keys(readableSleepData)

    }, [])
    const activityPropertyNames = useMemo(() => {
        return Object.keys(readableActivityData)

    }, [])
    const handlePropertyBtnClick = (type: HealthDataType, propertyName: string) => {
        if (propertyName === curPropertyName && type === curDataType) {
            return
        }
        setCurDataType(type)
        switch (type) {
            case (HealthDataType.Activity): {
                setCurPropertyName(readableActivityData[propertyName])
                break;
            }
            case (HealthDataType.Sleep): {
                setCurPropertyName(readableSleepData[propertyName])
                break;
            }
        }
    }
    const startDate = getDateOffset(new Date(), -PAST_DAYS_N)
    const endDate = getDateOffset(startDate, PAST_DAYS_N)
    const {data} = QueryHealthData(toShortISODate(startDate), toShortISODate(endDate), curDataType)
    return (
        <div className='flex-vertical'>

            <DataGraph
                type={curDataType}
                data={data}
                startDate={getDateOffset(new Date(), -PAST_DAYS_N)}
                interval={PAST_DAYS_N}
                propertyName={curPropertyName}
            />

            <h3>Activity</h3>
            <div className='flex-horizontal small-gap'>
                {
                    activityPropertyNames.map((name: string) => {
                        return (
                            <Button key={name} variant='contained' onClick={() => { handlePropertyBtnClick(HealthDataType.Activity, name) }}>
                                {name}
                            </Button>
                        )
                    })
                }
            </div>
            <h3>Sleep</h3>
            <div className='flex-horizontal small-gap'>
                {
                    sleepPropertyNames.map((name: string) => {
                        return (
                            <Button key={name} variant='contained' onClick={() => { handlePropertyBtnClick(HealthDataType.Sleep, name) }}>
                                {name}
                            </Button>
                        )
                    })
                }
            </div>
        </div>
    )
}