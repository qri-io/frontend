import { Workflow } from '../../qrimatic/workflow'

// TODO (ramfox): need to formalize possible trigger & on completion types

export const CSVDownload: Workflow = {
  id: 'CSVDownload',
  datasetID: 'me/csv_download_template',
  runCount: 0,
  disabled: false,

  triggers: [
    // repeat every hour
    { id: '', workflowID: '', type: 'cron', periodicity: 'R/PT1H' }
  ],
  steps: [
    { syntax: 'starlark', category: 'setup', name: 'setup', script: `# load starlark dependencies
load("http.star", "http")
load("encoding/csv.star", "csv")` },
    { syntax: 'starlark', category: 'download', name: 'download', script: `# get the popular baby names dataset as a csv
def download(ctx):
  csvDownloadUrl = "https://data.cityofnewyork.us/api/views/25th-nujf/rows.csv?accessType=DOWNLOAD"
  return http.get(csvDownloadUrl).body()` },
    { syntax: 'starlark', category: 'transform', name: 'transform', script: `# set the body
def transform(ds, ctx):
  # ctx.download is whatever download() returned
  csv = ctx.download
  # set the dataset body
  ds.set_body(csv, parse_as='csv')`},
    { syntax: 'qri', category: 'save', name: 'save', script: '' }
  ],
  onComplete: [
    { type: 'push', remote: 'https://registry.qri.cloud' }
  ]
}

export const APICall: Workflow = {
  id: 'APICall',
  runCount: 0,
  disabled: false,

  triggers: [
    // repeat every hour
    { id: '', workflowID: '', type: 'cron', periodicity: 'R/PT1H' }
  ],
  steps: [
    { syntax: 'starlark', category: 'setup', name: 'setup', script: `# load_ds("b5/apicall")` },
    { syntax: 'starlark', category: 'download', name: 'download', script: `def download(ctx):\n\treturn "your download here"` },
    { syntax: 'starlark', category: 'transform', name: 'transform', script: 'def transform(ds,ctx):\n\tds.set_body([[1,2,3],[4,5,6]])' },
    { syntax: 'qri', category: 'save', name: 'save', script: '' }
  ],
  onComplete: [
    { type: 'push', remote: 'https://registry.qri.cloud' }
  ]
} 

export const DatabaseQuery: Workflow = {
  id: 'DatabaseQuery',
  runCount: 0,
  disabled: false,

  triggers: [
    // repeat every hour
    { id: '', workflowID: '', type: 'cron', periodicity: 'R/PT1H' }
  ],
  steps: [
    { syntax: 'starlark', category: 'setup', name: 'setup', script: `# load_ds("b5/databasequery")` },
    { syntax: 'starlark', category: 'download', name: 'download', script: `def download(ctx):\n\treturn "your download here"` },
    { syntax: 'starlark', category: 'transform', name: 'transform', script: 'def transform(ds,ctx):\n\tds.set_body([[1,2,3],[4,5,6]])' },
    { syntax: 'qri', category: 'save', name: 'save', script: '' }
  ],
  onComplete: [
    { type: 'push', remote: 'https://registry.qri.cloud' }
  ]
} 

export const Webscrape: Workflow = {
  id: 'Webscrape',
  runCount: 0,
  disabled: false,
  
  triggers: [
    // repeat every hour
    { id: '', workflowID: '', type: 'cron', periodicity: 'R/PT1H' }
  ],
  steps: [
    { syntax: 'starlark', category: 'setup', name: 'setup', script: `# load_ds("b5/webscrape")` },
    { syntax: 'starlark', category: 'download', name: 'download', script: `def download(ctx):\n\treturn "your download here"` },
    { syntax: 'starlark', category: 'transform', name: 'transform', script: 'def transform(ds,ctx):\n\tds.set_body([[1,2,3],[4,5,6]])' },
    { syntax: 'qri', category: 'save', name: 'save', script: '' }
  ],
  onComplete: [
    { type: 'push', remote: 'https://registry.qri.cloud' }
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