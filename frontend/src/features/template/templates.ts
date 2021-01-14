import { Workflow } from '../../qrimatic/workflow'

// TODO (ramfox): need to formalize possible trigger & on completion types

export const CSVDownload: Workflow = {
  id: 'CSVDownload',
  triggers: [{
    // repeat every hour
    type: 'cron',
    value: 'R/PT1H'
  }],
  steps: [
    { type: 'starlark', name: 'setup', value: `# load starlark dependencies
load("http.star", "http")
load("encoding/csv.star", "csv")` },
    { type: 'starlark', name: 'download', value: `# get the popular baby names dataset as a csv
def download(ctx):
  csvDownloadUrl = "https://data.cityofnewyork.us/api/views/25th-nujf/rows.csv?accessType=DOWNLOAD"
  return http.get(csvDownloadUrl).body()` },
    { type: 'starlark', name: 'transform', value: `# set the body
def transform(ds, ctx):
  # ctx.download is whatever download() returned
  csv = ctx.download
  # set the dataset body
  ds.set_body(csv, parse_as='csv')`},
    { type: 'save', name: 'save', value: '' }
  ],
  onCompletion: [
    { type: 'push', value: 'https://registry.qri.cloud' }
  ]
}

export const APICall: Workflow = {
  id: 'APICall',
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

export const DatabaseQuery: Workflow = {
  id: 'DatabaseQuery',
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

export const Webscrape: Workflow = {
  id: 'Webscrape',
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

export const Templates: Record<string, Workflow> = {
  'CSVDownload': CSVDownload,
  'APICall': APICall,
  'DatabaseQuery': DatabaseQuery,
  'Webscrape': Webscrape
}

export function selectTemplate(id: string): Workflow {
  return Templates[id]
}