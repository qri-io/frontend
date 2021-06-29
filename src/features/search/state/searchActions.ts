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
  // TODO(arqu): We send the q param as in the POST body, but also as a url query to be able to work
  // across both cloud and core until the alignment between the two is complete. Should be POST only
  // with just the body
  return {
    type: 'search',
    [CALL_API]: {
      endpoint: 'registry/search',
      method: 'POST',
      body: {
        q: searchParams.q,
      },
      pageInfo: {
        page: searchParams.page,
        pageSize: searchParams.pageSize
      },
      query: mapFrontendParams(searchParams),
      map: mapSearchResults
    }
  }
}
