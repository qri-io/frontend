import { JSONSchema7 } from "json-schema"

import { QriRef } from "./ref"
import fileSize, { abbreviateNumber } from '../utils/fileSize'


export interface Dataset {
  username: string
  name: string
  path: string
  commit?: Commit
  meta?: Meta
  structure?: Structure
  body?: Body
  bodyPath?: string
  readme?: Readme
  transform?: Transform
  stats?: Stats
  viz?: Viz
}

export default Dataset

export function qriRefFromDataset(dataset: Dataset): QriRef {
  return {
    username: dataset.peername || dataset.username,
    name: dataset.name,
    path: dataset.path
  }
}

export function isDatasetEmpty(ds: Dataset): boolean {
  return (
    !ds.username &&
    !ds.name &&
    !ds.path &&
    !ds.commit &&
    !ds.meta &&
    !ds.structure &&
    !ds.body &&
    !ds.bodyPath &&
    !ds.readme &&
    !ds.transform &&
    !ds.stats &&
    !ds.viz)
}

export function NewDataset(d: Record<string,any>): Dataset {
  const dataset: Dataset = {
    username: d.peername || d.username || '',
    name: d.name || '',
    path: d.path || '',
    bodyPath: d.bodyPath
  }
  if (d.body) {
    dataset.body = d.body
  }
  if (d.commit) {
    dataset.commit = NewCommit(d.commit)
  }
  if (d.meta) {
    dataset.meta = NewMeta(d.meta)
  }
  if (d.structure) {
    dataset.structure = NewStructure(d.structure)
  }
  if (d.readme) {
    dataset.readme = NewReadme(d.readme)
  }
  if (d.transform) {
    dataset.transform = NewTransform(d.transform)
  }
  if (d.stats) {
    dataset.stats = NewStats(d.stats)
  }
  if (d.viz) {
    dataset.viz = NewViz(d.viz)
  }
  return dataset
}

export const ComponentNames = ['commit', 'meta', 'structure', 'readme', 'body', 'transform', 'viz', 'stats']

export type ComponentName =
 | 'readme'
 | 'meta'
 | 'body'
 | 'structure'
 | 'transform'
 | 'commit'
 | 'viz'
 | 'stats'

 export type ComponentStatus =
 | 'modified'
 | 'unmodified'
 | 'removed'
 | 'added'
 | 'add'
 | 'parse error'

export interface Component {
  qri: string
}

export function datasetComponents(d: Dataset): Component[] {
  return ComponentNames.reduce((acc, name) => {
    const comp = getComponentFromDatasetByName(d, name)
    if (comp) {
      acc.push(comp)
    }
    return acc
  }, [] as Component[])
}

export function getComponentFromDatasetByName(d: Dataset, component: string): Component | undefined {
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
      return {
        qri: 'bd:0',
        body: d.body
      } as BodyComponent
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

export interface Commit extends Component {
  author?: string
  message?: string
  path?: string
  timestamp?: Date
  title?: string
  count?: number // commit chain height
}

export function NewCommit(d: Record<string,any>): Commit {
  return {
    qri: d.qri || 'cm:0',
    author: d.author,
    message: d.message,
    path: d.path,
    timestamp: d.timestamp,
    title: d.title,
    count: d.count
  }
}

export interface Meta extends Component {
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

export function NewMeta(d: Record<string,any>): Meta {
  return Object.assign({ qri: 'md:0' }, d)
}


export const standardFieldNames = [
  'accessUrl',
  'accrualPeriodicity',
  'citations',
  'contributors',
  'description',
  'downloadUrl',
  'homeUrl',
  'identifier',
  'keywords',
  'language',
  'license',
  'readmeUrl',
  'title',
  'theme',
  'version'
]

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

export interface Structure extends Component {
  depth?: number
  entries: number
  format: BodyDataFormat
  length: number
  errCount: number
  formatConfig?: CSVFormatConfig | JSONFormatConfig | XLSXFormatConfig
  schema?: Schema
}

export interface Stat {
  label: string
  value: any
  /**
   * if the value is a file, we should be displaying it differently than a regular
   * number. This only affects values with `number` types. Defaults to `false`
   */
  inBytes?: boolean
  /**
   * delta is only used for numerical values, intended to show the difference
   * between this number and some other value. negative numbers are showing in
   * red, positive in green
   */
  delta?: number
}

export function getStats (data: Structure): Stat[] {
  return [
    { 'label': 'format', 'value': data.format ? data.format.toUpperCase() : 'unknown' },
    { 'label': 'body size', 'value': data.length ? fileSize(data.length) : '—' },
    { 'label': 'entries', 'value': abbreviateNumber(data.entries) || '—' },
    { 'label': 'errors', 'value': data.errCount ? abbreviateNumber(data.errCount) : '—' },
    { 'label': 'depth', 'value': data.depth || '—' }
  ]
}

export type BodyDataFormat =
| "cbor"
| "json"
| "csv"
| "xlsx"
| ""         // unknown format

export function NewStructure(d: Record<string,any>): Structure {
  return {
    qri: d.qri || 'st:0',
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

export interface Stats extends Component {
  path: string
  stats: IStatTypes[]
}

export function NewStats(d: Record<string,any>): Stats {
  return {
    qri: d.qri || 'sa:0',
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

export interface Transform extends Component {
  bodyBytes?: string
  steps: TransformStep[]
  syntaxes?: Record<string,string>
}

export function NewTransform(d: Record<string,any>): Transform {
  return {
    qri: d.qri || 'tf:0',
    bodyBytes: d.bodyBytes,
    steps: d.steps
  }
}

export interface TransformStep {
  category: string
  name: string
  syntax: string
  script: string
}

export function NewTransformStep(data: Record<string,any>): TransformStep {
  return {
    name: data.name,
    syntax: data.syntax,
    category: data.category,
    script: data.script
  }
}

export function scriptFromTransform(t: Transform): string {
  if (t && t.steps) {
    return t.steps.reduce((acc: string, step: TransformStep, i: number) => {
      if (step.script && step.script !== "") {
        acc += step.script + "\n\n"
      }
      return acc
    }, '')
  }
  return ''
}

export interface Readme extends Component {
  scriptPath: string
  text: string
}

export function NewReadme(d: Record<string,any>): Readme {
  return {
    qri: d.qri || 'rm:0',
    scriptPath: d.scriptPath,
    text: d.text
  }
}

export interface BodyComponent extends Component {
  body: Body
}

export interface Viz extends Component {
  scriptPath?: string
  script?: string
}

export function NewViz(d: Record<string,any>): Viz {
  return {
    qri: d.qri || 'vz:0',
    scriptPath: d.scriptPath,
    script: d.script
  }
}

export type Body = Record<string, any> | any[][]

export function schemaToColumns (schema: Schema): ColumnProperties[] {
  if (schema && schema.items && isJSONSchema7(schema.items) && schema.items.items && Array.isArray(schema.items.items)) {
    return schema.items.items as ColumnProperties[]
  }
  return []
}

function isJSONSchema7 (x: any): x is JSONSchema7 {
  return (x as JSONSchema7).type !== undefined
}

export function extractColumnHeaders (structure: Structure, value: any[]): ColumnProperties[] {
  if (!structure || !value) {
    return []
  }
  const schema = structure.schema

  if (!schema) {
    const firstRow = value && value[0]
    if (!firstRow) return []
    return firstRow.map((d: any, i: number) => `field_${i + 1}`)
  }

  return schemaToColumns(schema)
}
