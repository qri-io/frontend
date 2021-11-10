import { createReducer } from "@reduxjs/toolkit"
import { RootState } from "../../../store/store"
import { SearchResult } from "../../../qri/search"

export interface SplashState {
  datasets: Record<string, SearchResult[]>
  loading: boolean
}

export const selectSplashDatasets = (state: RootState): Record<string, SearchResult[]> => state.splash.datasets

export const selectSplashDatasetsLoading = (state: RootState): boolean => state.splash.loading

const initialState: SplashState = {
  datasets: {
    popular: [],
    latest: [],
    automated: []
  },
  loading: true
}

export const splashReducer = createReducer(initialState, {
  'API_SPLASH_REQUEST': (state, action) => {
    state.loading = true
  },
  'API_SPLASH_SUCCESS': (state, action) => {
    state.loading = false
    state.datasets = action.payload.data
  },
  'API_SPLASH_FAILURE': (state, action) => {
    state.loading = false
  }
})
