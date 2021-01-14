import { QriRef } from "./ref";

// VersionInfo pulls details from a dataset at a specific commit in a version
// history. It's flat, plain data representation of a dataset meant for listing.
// VersionInfo is a superset of a Reference, embedding all fields a reference

// contains, and a subset of a Dataset, which fully describes a single version
export interface VersionInfo {
  // reference details
  username: string      // human-readble name of the owner of this dataset
  profileId: string     // user identifier
  name: string          // dataset name
  path: string          // commit hash, eg: /ipfs/QmY9WcXXUnHJbYRA28LRctiL4qu4y...

  fsiPath: string       // path to a local filesystem-linked directory (if exists)
  foreign?: boolean      // is block data for this commit stored locally?
  published?: boolean    // published tells whether or not a dataset is published

  metaTitle: string     // dataset meta.Title field
  themeList: string     // meta.Themes array as a "comma,separated,string"

  bodyFormat: string    // data format of the body
  bodySize?: number     // length of body data in bytes
  bodyRows?: number     // number of rows in the body
  numErrors?: number    // number of validation errors in the body

  commitTitle?: string   // title of commit
  commitMessage?: string // commit description message
  commitTime?: string    // commit.Timestamp field, time of version creation
  numVersions?: number  // number of commits in history
}

export function newVersionInfo(data: Record<string,any>): VersionInfo {
  return {
    username: data.username || '',
    profileId: data.profileId || '',
    name: data.name || '',
    path: data.path || '',
    
    fsiPath: data.fsiPath || '',
    foreign: data.foreign,
    published: data.published,

    metaTitle: data.metaTitle || '',
    themeList: data.themeList || '',

    bodyFormat: data.bodyFormat || '-',
    bodySize: data.bodySize,
    bodyRows: data.bodyRows,
    numErrors: data.numErrors,

    commitTitle: data.commitTitle,
    commitMessage: data.commitMessage,
    commitTime: data.commitTime,
    numVersions: data.numVersions
  }
}

export function qriRefFromVersionInfo (vi: VersionInfo): QriRef {
  return {
    username: vi.username,
    profileId: vi.profileId,
    name: vi.name,
    path: vi.path
  }
}