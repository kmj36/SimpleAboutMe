import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface LoadingState {
    value: boolean
}

const initialState = {
    value: true,
} as LoadingState

export const LoadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        loading: (state) => {
            state.value = true
        },
        done: (state) => {
            state.value = false
        }
     }
})

export const { loading, done } = LoadingSlice.actions;

export const selectLoadState = (state: RootState) => state.loading.value

export default LoadingSlice.reducer;