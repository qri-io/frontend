
// ChangeStatus enumerates the all possible state shifts in dataset components
// between two versions of a dataset
export enum ChangeStatus {
  nonexistant = 0,
  unchanged = 1,
  added = 2,
  removed = 3,
  modified = 4
}

// info about a dataset component as compared the same component in previous
// commit
export interface StatusInfo {
  filepath: string
  status: ComponentStatus
  mtime?: Date
  errors?: object[]
  warnings?: object[]
  component?: string
}

export type ComponentStatus =
  | 'modified'
  | 'unmodified'
  | 'removed'
  | 'added'
  | 'add'
  | 'parse error'

export function hasParseError (statusInfo: StatusInfo): boolean {
  return statusInfo.status === 'parse error'
}
