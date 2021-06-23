import { ApiAction, ApiActionThunk, CALL_API } from "../../../store/api";

import { NewSearchResult, SearchParams } from '../../../qri/search'

export function loadSearchResults(searchParams: SearchParams): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch(fetchSearchResults(searchParams))
  }
}

const mapSearchResults = (results) => {
  return results.map((d) => NewSearchResult(d))
}

const mapFrontendParams = (frontendParams: SearchParams) => {
  // map frontend 'sort' param to backend 'orderBy'
  return {
    q: frontendParams.q,
    orderBy: frontendParams.sort === 'recentlyupdated' ? 'created,desc' : 'name,asc'
  }
}

function fetchSearchResults (searchParams: SearchParams): ApiAction {
  return {
    type: 'search',
    [CALL_API]: {
      endpoint: 'remote/search',
      method: 'POST',
      body: {
        query: mapFrontendParams(searchParams),
      },
      pageInfo: {
        page: searchParams.page,
        pageSize: searchParams.pageSize
      },
      map: mapSearchResults
    }
  }
}
