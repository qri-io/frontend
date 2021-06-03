import { Dataset, NewDataset } from './dataset'

export interface PageInfo {
  nextUrl: string
  page: number
  pageSize: number
  pageCount: number
  prevUrl: string
  resultCount: number
}

export interface SearchParams {
  q: string
  sort: '' | 'name' | 'recentlyupdated'
  page: number
  pageSize: number
}

const DEFAULT_SORT = 'recentlyupdated'
const DEFAULT_PAGE = 1
const DEFAULT_PAGESIZE = 25

export function NewSearchParams(d: Record<string,any>): SearchParams {
  return {
    q: d.q || '',
    sort: d.sort || DEFAULT_SORT,
    page: d.page || DEFAULT_PAGE,
    pageSize: d.pageSize || DEFAULT_PAGESIZE
  }
}

export function CleanSearchParams(d: SearchParams): Record<string, any> {
  const cleanParams:any = {
    q: d.q
  }
  if (d.sort !== DEFAULT_SORT) { cleanParams.sort = d.sort }
  if (d.page !== DEFAULT_PAGE) { cleanParams.page = d.page }
  if (d.pageSize !== DEFAULT_PAGESIZE) { cleanParams.pageSize = d.pageSize }

  return cleanParams
}

export interface SearchResult extends Dataset {
  followStats: {
    followCount: number
    followStatus: number
  }
  issueStats: {
    openIssues: number
    closedIssues: number
  }
}

export function NewSearchResult(d: Record<string,any>): SearchResult {
  const ds = NewDataset(d)
  let stats
  let followStats
  let issueStats

  if (d.stats) {
    stats = {
      downloadCount: d.stats.download_count,
      pullCount: d.stats.pull_count,
      viewCount: d.stats.view_count
    }
  }

  if (d.follow_stats) {
    followStats = {
      followCount: d.follow_stats.follow_count,
      followStatus: d.follow_stats.follow_status
    }
  }

  if (d.issue_stats) {
    issueStats = {
      openIssues: d.issue_stats.open_issues,
      closedIssues: d.issue_stats.closed_issues
    }
  }

  return {
    ...ds,
    stats,
    followStats: d.followStats || followStats,
    issueStats: d.issueStats || issueStats
  }
}
