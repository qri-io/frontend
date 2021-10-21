import { QriRef } from "./ref"
import { RunStatus } from './run'
// VersionInfo pulls details from a dataset at a specific commit in a version
// history. It's flat, plain data representation of a dataset meant for listing.
// VersionInfo is a superset of a Reference, embedding all fields a reference

// contains, and a subset of a Dataset, which fully describes a single version
export interface VersionInfo {
  // reference details
  initID: string
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

  workflowID?: string // workflow identifier
  workflowTriggerDescription?: string

  runID?: string
  runStatus?: RunStatus
  runDuration?: number // duration of the run in nanoseconds
  runStart?: string

  // TODO (boandriy): These fields are only temporarily living on `VersionInfo`.
  // When we get more user feedback and settle what info
  // users want about their datasets, these fields may move to a new struct
  // store, or subsystem.
  runCount: number // RunCount is the number of times this dataset's transform has been run
  commitCount: number // CommitCount is the number of commits in this dataset's history
  downloadCount: number // DownloadCount is the number of times this dataset has been directly downloaded from this Qri node
  followerCount: number // FollowerCount is the number of followers this dataset has on this Qri node
  openIssueCount: number // OpenIssueCount is the number of open issues this dataset has on this Qri node
}

export function newVersionInfo(data: Record<string,any>): VersionInfo {
  return {
    initID: data.initID || '',
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
    numVersions: data.numVersions,

    workflowID: data.workflowID,
    workflowTriggerDescription: data.workflowTriggerDescription,

    runID: data.runID,
    runStatus: data.runStatus,
    runDuration: data.runDuration,
    runStart: data.runStart,

    // TODO(boandriy): the following fields are likely to be removed from the VersionInfo
    // type in the future
    runCount: data.runCount || 0,
    commitCount: data.commitCount || 0,
    downloadCount: data.downloadCount || 0,
    followerCount: data.followerCount || 0,
    openIssueCount: data.openIssueCount || 0

  }
}

export function datasetAliasFromVersionInfo(vi: VersionInfo): string {
  if(vi && vi.username && vi.name){
    return `${vi.username}/${vi.name}`
  }
  return ''
}

export function qriRefFromVersionInfo (vi: VersionInfo): QriRef {
  return {
    username: vi.username,
    profileId: vi.profileId,
    name: vi.name,
    path: vi.path
  }
}

export function filterVersionInfos(collection: VersionInfo[], searchString: string): VersionInfo[] {
  return collection.filter((d) => [
      d.username,
      d.name,
      d.metaTitle,
      d.themeList,
      d.path,
    ].findIndex((f: string) => f.includes(searchString)) > -1
  )
}
