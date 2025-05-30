import { createAsyncThunk, createSelector, createSlice, current } from '@reduxjs/toolkit';
import { RootState } from './store';
import AppleHealthKit, {
    HealthValue,
    HealthKitPermissions,
    HealthInputOptions, HealthUnit
} from 'react-native-health'
import {
    initialize,
    requestPermission,
    readRecords
} from 'react-native-health-connect'
import { Platform } from 'expo-modules-core';
import { read } from 'fs';


const iOSPermissions: HealthKitPermissions = {
    permissions: {
        read: [
            AppleHealthKit.Constants.Permissions.Steps,
            AppleHealthKit.Constants.Permissions.DistanceWalkingRunning
        ],
        write: []
    }
}

export interface healthDataState {
    numSteps: number,
    distanceTraveled: number
}

const initialState: healthDataState = {
    numSteps: 0,
    distanceTraveled: 0
}

export const fetchHealthDataAndroid = createAsyncThunk(
    'healthData/fetchHealthDataAndroid',
    async () => {
        const isInitialized = await initialize()

        if (!isInitialized) return null

        const grantedPermissions = await requestPermission([
            { accessType: 'read', recordType: 'Steps' },
            { accessType: 'read', recordType: 'Distance'}
        ])

        if (!grantedPermissions) return null

        const date = new Date()
        const startOfDay = new Date(date.setHours(0, 0, 0, 0)).toISOString()
        const endOfDay = new Date(date.setHours(23, 59, 59, 999)).toISOString()

        const stepsData = await readRecords<'Steps'>('Steps', {
            timeRangeFilter: {
                operator: 'between',
                startTime: startOfDay,
                endTime: endOfDay
            }
        })

        if (!Array.isArray(stepsData)) return null

        const steps: number = stepsData.reduce((sum, record) => sum + record.count, 0)

        const distanceData = await readRecords('Distance', {
            timeRangeFilter: {
                operator: 'between',
                startTime: startOfDay,
                endTime: endOfDay
            }
        })

        if (!Array.isArray(distanceData)) return null

        let distance: number = distanceData.reduce((sum, record) => sum + record.distance.inMeters, 0)
        distance = distance / 1609.344

        return {
            distance: distance,
            steps: steps
           }

    }
)

export const initHealthDataIOS = function(){
    AppleHealthKit.initHealthKit(iOSPermissions, (err) => {
        if (err){
            console.error("ERROR GETTING APPLE HEALTHKIT PERMISSIONS")
        }
    })
}

const getStepsDataIOS = function (){
    return new Promise((resolve, reject) => {
        const stepOptions: HealthInputOptions = {}

        AppleHealthKit.getStepCount(stepOptions, (err, results) => {
            if (err){ return reject("ERROR GETTING APPLE STEP COUNT") }
            resolve(results.value)
        })
    })
}

const getDistanceDataIOS = function (){
    return new Promise((resolve, reject) => {
        //error listed, but this does not impact app functionality
        const distanceOptions: HealthInputOptions = {unit: "mile"}
        

        AppleHealthKit.getDistanceWalkingRunning(distanceOptions, (err, results) => {
            if (err){ return reject("ERROR GETTING APPLE WALKING/RUNNING DISTANCE")}
            resolve(results.value)
        })
    })
}




export const fetchStepsDataIOS = createAsyncThunk(
    'healthData/fetchStepsDataIOS',
    async () => {
        let steps = 0

       try {
            const s = await getStepsDataIOS()
            steps = Number(s)

       } catch (error) {
            console.error(error)
            return { steps: steps}
       }

       return {
        steps: steps,
       }
    }
)

export const fetchDistanceDataIOS = createAsyncThunk(
    'healthData/fetchDistanceDataIOS',
    async () => {
        let distance = 0

       try {
            const d = await getDistanceDataIOS()
            distance = Number(d)

       } catch (error) {
            console.error(error)
            return { distance: distance}
       }

       return {
        distance: distance,
       }
    }
)

const healthDataSlice = createSlice({
    name: 'healthData',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchStepsDataIOS.fulfilled, (state, action) => {
            state.numSteps = action.payload.steps
            console.log("HEALTH DATA --- STEPS: ", state.numSteps)
        }),
        builder.addCase(fetchDistanceDataIOS.fulfilled, (state, action) => {
            state.distanceTraveled = action.payload.distance
            console.log("HEALTH DATA --- DISTANCE: ", state.distanceTraveled)
        }),
        builder.addCase(fetchHealthDataAndroid.fulfilled, (state, action) => {
            state.distanceTraveled = action.payload?.distance ?? 0
            state.numSteps = action.payload?.steps ?? 0
            console.log("HEALTH DATA --- DISTANCE: ", state.distanceTraveled)
            console.log("HEALTH DATA --- STEPS: ", state.numSteps)
        })
    }

})

export default healthDataSlice.reducer
export const selectStepsData = (state: RootState) => state.healthDataSlice.numSteps
export const selectDistanceData = (state: RootState) => state.healthDataSlice.distanceTraveled