// TODO (b5) - move TransformStep definition into this
import { TransformStep } from "../qrimatic/workflow"

export interface Dataset {
  peername: string
  name: string
  path: string
  commit?: Commit
  meta?: Meta
  structure?: Structure
  body?: Body
  bodyPath?: string
  readme?: string
  transform?: Transform
  stats?: Stats
  viz?: string
}

export default Dataset

export function newDataset(d: Record<string,any>): Dataset {
  return {
    peername: d.peername || '',
    name: d.name || '',
    path: d.path || '',

    commit: newCommit(d.commit || {}),
    meta: newMeta(d.meta || {}),
    structure: newStructure(d.structure || {}),
    body: d.body,
    bodyPath: d.bodyPath,
    readme: d.readme,
    transform: newTransform(d.transform || {}),
    stats: newStats(d.stats || {}),
    viz: d.viz
  }
}

export function getComponentFromDatasetByName(d: Dataset, component: string): string | Record<string, any> | undefined {
  if (!ComponentNames.includes(component)) {
    return
  }
  
  switch (component) {
    case 'commit':
      return d.commit
    case 'meta':
      return d.meta
    case 'structure':
      return d.structure
    case 'body':
      return d.body
    case 'readme':
      return d.readme
    case 'transform':
      return d.transform
    case 'stats':
      return d.stats
    case 'viz':
      return d.viz
  }
}

export interface Commit {
  author?: string
  message?: string
  path?: string
  timestamp?: Date
  title?: string
  count?: number // commit chain height
}

export function newCommit(d: Record<string,any>): Commit {
  return {
    author: d.author,
    message: d.message,
    path: d.path,
    timestamp: d.timestamp,
    title: d.title,
    count: d.count
  }
}

export interface Meta {
  accessURL?: string
  accrualPeriodicity?: string
  citations?: Citation[]
  contributors?: User[]
  description?: string
  downloadURL?: string
  homeURL?: string
  identifier?: string
  keywords?: string[]
  language?: string[]
  license?: License
  readmeURL?: string
  title?: string
  theme?: string[]
  version?: string
  [key: string]: any
}

export function newMeta(d: Record<string,any>): Meta {
  return Object.assign({}, d)
}

// meta.citations
export interface Citation {
  name: string
  url: string
  email: string
  [key: string]: any
}

// meta.contributors
export interface User {
  id: string
  name: string
  email: string
  [key: string]: any
}

export interface License {
  type: string
  url: string
}

export interface Structure {
  depth?: number
  entries: number
  format?: string
  length: number
  errCount: number
  formatConfig?: CSVFormatConfig | JSONFormatConfig | XLSXFormatConfig
  schema?: Schema
}

export function newStructure(d: Record<string,any>): Structure {
  return {
    depth: d.depth,
    entries: d.entries,
    format: d.format,
    length: d.length,
    errCount: d.errCount,
    formatConfig: d.formatConfig,
    schema: d.schema,
  }
}

export interface CSVFormatConfig {
  headerRow: boolean
  lazyQuotes: boolean
  variadicFields: boolean
  [key: string]: any
}

export interface JSONFormatConfig {
  pretty: boolean
  [key: string]: any
}

export interface XLSXFormatConfig {
  sheetName: string
  [key: string]: any
}

export interface ColumnProperties {
  title?: string
  type?: string | string[]
  [key: string]: any
}

export interface Schema {
  [key: string]: any
}

export interface Stats {
  path: string
  stats: IStatTypes[]
}

export function newStats(d: Record<string,any>): Stats {
  return {
    path: d.path,
    stats: d.stats,
  }
}

export type IStatTypes = IBooleanStats | IStringStats | INumericStats

// boolean
export interface IBooleanStats {
  // needed so we can index into the object using a string field name
  [key: string]: any
  type: 'boolean'
  true: number
  false: number
  count: number
}

// string
export interface IStringStats {
  // needed so we can index into the object using a string field name
  [key: string]: any
  type: 'string'
  count: number
  maxLength: number
  minLength: number
  unique: number
  frequencies: {
    [key: string]: number
  }
}

// numeric
export interface INumericStats {
  // needed so we can index into the object using a string field name
  [key: string]: any
  type: 'numeric'
  count: number
  max: number
  mean: number
  median: number
  min: number
  histogram: {
    bins: number[]
    frequencies: number[]
  }
}

export interface Transform {
  syntax: string
  bodyBytes?: string
  steps: TransformStep[]
}

export function newTransform(d: Record<string,any>): Transform {
  return {
    syntax: d.syntax || '',
    bodyBytes: d.bodyBytes,
    steps: d.steps
  }
}

export type Body = Record<string, any> | any[][]

export const ComponentNames = ['commit', 'meta', 'structure', 'readme', 'body', 'transform', 'viz', 'stats']
export type ComponentTypes = 'readme' | 'meta' | 'body' | 'structure' | 'transform' | 'commit' | 'viz' | 'stats'