import { Workflow } from '../../qrimatic/workflow'

export enum TemplateType {
  CSVDownload = 'CSVDownload',
  APICall = 'APICall',
  DatabaseQuery = 'DatabaseQuery',
  Webscrape = 'Webscrape'
}

export interface ITemplate extends Workflow {
  type: TemplateType
}

// TODO (ramfox): need to formalize possible trigger & on completion types

export const CSVDownload:  ITemplate = {
  type: TemplateType.CSVDownload,
  triggers: [{
    // repeat every hour
    type: 'cron',
    value: 'R/PT1H'
  }],
  steps: [
    { type: 'starlark', name: 'setup', value: `# load_ds("b5/csvdownload")` },
    { type: 'starlark', name: 'download', value: `def download(ctx):\n\treturn "your download here"` },
    { type: 'starlark', name: 'transform', value: 'def transform(ds,ctx):\n\tds.set_body([[1,2,3],[4,5,6]])' },
    { type: 'save', name: 'save', value: '' }
  ],
  onCompletion: [
    { type: 'push', value: 'https://registry.qri.cloud' }
  ]
} 

export const APICall:  ITemplate = {
  type: TemplateType.APICall,
  triggers: [{
    // repeat every hour
    type: 'cron',
    value: 'R/PT1H'
  }],
  steps: [
    { type: 'starlark', name: 'setup', value: `# load_ds("b5/apicall")` },
    { type: 'starlark', name: 'download', value: `def download(ctx):\n\treturn "your download here"` },
    { type: 'starlark', name: 'transform', value: 'def transform(ds,ctx):\n\tds.set_body([[1,2,3],[4,5,6]])' },
    { type: 'save', name: 'save', value: '' }
  ],
  onCompletion: [
    { type: 'push', value: 'https://registry.qri.cloud' }
  ]
} 

export const DatabaseQuery:  ITemplate = {
  type: TemplateType.DatabaseQuery,
  triggers: [{
    // repeat every hour
    type: 'cron',
    value: 'R/PT1H'
  }],
  steps: [
    { type: 'starlark', name: 'setup', value: `# load_ds("b5/databasequery")` },
    { type: 'starlark', name: 'download', value: `def download(ctx):\n\treturn "your download here"` },
    { type: 'starlark', name: 'transform', value: 'def transform(ds,ctx):\n\tds.set_body([[1,2,3],[4,5,6]])' },
    { type: 'save', name: 'save', value: '' }
  ],
  onCompletion: [
    { type: 'push', value: 'https://registry.qri.cloud' }
  ]
} 

export const Webscrape:  ITemplate = {
  type: TemplateType.Webscrape,
  triggers: [{
    // repeat every hour
    type: 'cron',
    value: 'R/PT1H'
  }],
  steps: [
    { type: 'starlark', name: 'setup', value: `# load_ds("b5/webscrape")` },
    { type: 'starlark', name: 'download', value: `def download(ctx):\n\treturn "your download here"` },
    { type: 'starlark', name: 'transform', value: 'def transform(ds,ctx):\n\tds.set_body([[1,2,3],[4,5,6]])' },
    { type: 'save', name: 'save', value: '' }
  ],
  onCompletion: [
    { type: 'push', value: 'https://registry.qri.cloud' }
  ]
} 

export const Templates: {[key in TemplateType]: ITemplate} = {
  [TemplateType.CSVDownload]: CSVDownload,
  [TemplateType.APICall]: APICall,
  [TemplateType.DatabaseQuery]: DatabaseQuery,
  [TemplateType.Webscrape]: Webscrape
}

export function selectTemplate(templateType: TemplateType): ITemplate {
  return Templates[templateType]
}