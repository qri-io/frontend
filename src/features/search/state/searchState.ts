import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store';
import { SearchResult, PageInfo } from '../../../qri/search'

export const selectSearchResults = (state: RootState): SearchResult[] => state.search.results
export const selectSearchPageInfo = (state: RootState): PageInfo => state.search.pageInfo
export const selectSearchLoading = (state: RootState): boolean => state.search.loading


export interface SearchState {
  results: SearchResult[]
  pageInfo: PageInfo
  loading: boolean
}

const initialState: SearchState = {
  results: [],
  pageInfo: {
    nextUrl: '',
    page: 0,
    pageSize: 0,
    pageCount: 0,
    prevUrl: '',
    resultCount: 0
  },
  loading: false
}

export const searchReducer = createReducer(initialState, {
  'API_SEARCH_REQUEST': (state: SearchState, action) => {
    state.loading = true
  },
  'API_SEARCH_SUCCESS': (state: SearchState, action) => {
    state.results = action.payload.data
    state.loading = false
    state.pageInfo = action.payload.pagination
  },
  'API_SEARCH_FAILURE': (state: SearchState) => {
    state.loading = false
  },
})
