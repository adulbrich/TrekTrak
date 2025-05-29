import { createAsyncThunk, createSelector, createSlice, current } from '@reduxjs/toolkit';
import { RootState } from './store';
import AppleHealthKit, {
    HealthValue,
    HealthKitPermissions,
    HealthInputOptions, HealthUnit
} from 'react-native-health'
import { Platform } from 'expo-modules-core';


const permissions: HealthKitPermissions = {
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

const getStepsData = function (){
    return new Promise((resolve, reject) => {
        const stepOptions: HealthInputOptions = {}

        AppleHealthKit.getStepCount(stepOptions, (err, results) => {
            if (err){ return reject("ERROR GETTING APPLE STEP COUNT") }
            resolve(results.value)
        })
    })
}

const getDistanceData = function (){
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
            const s = await getStepsData()
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
            const d = await getDistanceData()
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
        })
    }

})

export default healthDataSlice.reducer
export const selectStepsData = (state: RootState) => state.healthDataSlice.numSteps
export const selectDistanceData = (state: RootState) => state.healthDataSlice.distanceTraveled