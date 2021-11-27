
export interface UserProfile {
  profile_id: string
  privKey: string
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
  photo: string
  poster: string
  twitter: string
  peerIDs: string[]
  networkAddrs: string[]
  id: string
  currentKey: string
  emailConfirmed: boolean
  isAdmin: boolean
}

export const NewUserProfile = (d: Record<string, any>): UserProfile => {
  let created = 0
  let updated = 0

  if (typeof d.created === 'string') {
    const c = new Date(created)
    created = c.getTime() / 1000
  } else if (d.created) {
    created = d.created
  }

  if (typeof d.updated === 'string') {
    const u = new Date(updated)
    updated = u.getTime() / 1000
  } else if (d.updated) {
    updated = d.updated
  }
  return {
    profile_id: d.id || d.profile_id || '',
    privKey: d.privKey || d.PrivKey || '',
    username: d.username || '',
    created,
    updated,
    type: d.type || '',
    email: d.email || '',
    name: d.name || '',
    description: d.description || '',
    home_url: d.home_url || '',
    color: d.color || '',
    thumb: d.thumb || '',
    photo: d.photo || '',
    poster: d.poster || '',
    twitter: d.twitter || '',
    peerIDs: d.peerIDs || d.PeerIDs || [],
    networkAddrs: d.networkAddrs || d.NetworkAddrs || [],
    id: d.id || '',
    currentKey: d.currentKey || '',
    emailConfirmed: d.emailConfirmed || d.EmailConfirmed || '',
    isAdmin: d.isAdmin || d.IsAdmin || false
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
export function NewUserProfileDatasetListParams (d: any): UserProfileDatasetListParams {
  return {
    sort: d.sort || DEFAULT_SORT,
    page: d.page || DEFAULT_PAGE,
    pageSize: d.pageSize || DEFAULT_PAGESIZE
  }
}

// returns only the non-default values, useful for excluding default values from query parameter strings
export function CleanUserProfileDatasetListParams (d: UserProfileDatasetListParams): Record<string, any> {
  const cleanParams: any = {}
  if (d.sort !== DEFAULT_SORT) { cleanParams.sort = d.sort }
  if (d.page !== DEFAULT_PAGE) { cleanParams.page = d.page }
  if (d.pageSize !== DEFAULT_PAGESIZE) { cleanParams.pageSize = d.pageSize }

  return cleanParams
}
