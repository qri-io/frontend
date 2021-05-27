import { ApiAction, ApiActionThunk, CALL_API } from "../../../store/api";

import { NewSearchResult } from '../../../qri/search'

export const searchPageSizeDefault = 25

export function loadSearchResults(q: string, page: number = 1, pageSize: number = searchPageSizeDefault): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch(fetchSearchResults(q, page, pageSize))
  }
}

const mapSearchResults = (results) => {
  return results.map((d) => NewSearchResult(d))
}

function fetchSearchResults (q: string, page: number, pageSize: number): ApiAction {
  return {
    type: 'search',
    [CALL_API]: {
      endpoint: 'search',
      method: 'GET',
      pageInfo: {
        page,
        pageSize
      },
      query: { q },
      map: mapSearchResults
    }
  }
}
