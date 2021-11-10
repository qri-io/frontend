import { ApiAction, ApiActionThunk, CALL_API } from "../../../store/api"
import { NewSearchResult, SearchResult } from "../../../qri/search"

function mapSplashSearchResults (results: Record<string, any[]>): Record<string, SearchResult[]> {
  const keys: string[] = Object.keys(results)
  const newResult: Record<string, SearchResult[]> = results
  keys.forEach((k, index) => {
    newResult[k] = newResult[k].map((d: Record<string, any>) => NewSearchResult(d))
  })
  return newResult
}

export function loadSplashDatasets (): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch(fetchSplashDatasets())
  }
}

export function fetchSplashDatasets (): ApiAction {
  return {
    type: 'splash',
    [CALL_API]: {
      endpoint: 'dataset_summary/splash',
      method: 'GET',
      map: mapSplashSearchResults
    }
  }
}
