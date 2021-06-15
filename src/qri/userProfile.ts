
export interface UserProfile {
  profile_id: string
  PrivKey: string
  username: string
  created: number
  updated: number
  type: string
  email: string
  name: string
  description: string
  home_url: string
  color: string
  thumb: string
  profile: string
  poster: string
  twitter: string
  PeerIDs: string[]
  NetworkAddrs: string[]
  id: string
  currentKey: string
  EmailConfirmed: boolean
  isAdmin: boolean
}

export const NewUserProfile = () => {
  return {
    profile_id: '',
    PrivKey: '',
    username: '',
    created: 0,
    updated: 0,
    type: '',
    email: '',
    name: '',
    description: '',
    home_url: '',
    color: '',
    thumb: '',
    profile: '',
    poster: '',
    twitter: '',
    PeerIDs: [],
    NetworkAddrs: [],
    id: '',
    currentKey: '',
    EmailConfirmed: false,
    isAdmin: false
  }
}

export interface UserProfileDatasetListParams {
  sort: 'name' | 'recentlyupdated'
  page: number
  pageSize: number
}

const DEFAULT_SORT = 'recentlyupdated'
const DEFAULT_PAGE = 1
const DEFAULT_PAGESIZE = 25

// returns a fully populated UserProfileDatasetListParams by adding defaults for undefined values
export function NewUserProfileDatasetListParams(d: any): UserProfileDatasetListParams {
  return {
    sort: d.sort || DEFAULT_SORT,
    page: d.page || DEFAULT_PAGE,
    pageSize: d.pageSize || DEFAULT_PAGESIZE
  }
}

// returns only the non-default values, useful for excluding default values from query parameter strings
export function CleanUserProfileDatasetListParams(d: UserProfileDatasetListParams): Record<string, any> {
  const cleanParams:any = {}
  if (d.sort !== DEFAULT_SORT) { cleanParams.sort = d.sort }
  if (d.page !== DEFAULT_PAGE) { cleanParams.page = d.page }
  if (d.pageSize !== DEFAULT_PAGESIZE) { cleanParams.pageSize = d.pageSize }

  return cleanParams
}
