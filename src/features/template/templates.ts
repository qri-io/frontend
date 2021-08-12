import { Workflow } from '../../qrimatic/workflow'

// TODO (ramfox): need to formalize possible trigger & on completion types

export const Blank: Workflow = {
  id: 'Blank',
  runCount: 0,
  disabled: false,

  triggers: [
    // repeat every hour
    { id: '', workflowID: '', type: 'cron', periodicity: 'R/PT1H' }
  ],
  steps: [
    { syntax: 'starlark', category: 'setup', name: 'setup', script: `# load starlark dependencies
# load("http.star", "http")
# load("encoding/csv.star", "csv")` },
    { syntax: 'starlark', category: 'download', name: 'download', script: `# download web assets
def download(ctx):
  return None` },
    { syntax: 'starlark', category: 'transform', name: 'transform', script: `# shape & clean data
def transform(ds, ctx):
  csv = ctx.download
  ds.set_body(csv, parse_as='csv')`}
  ],
  hooks: [
    { type: 'push', remote: 'https://registry.qri.cloud' }
  ]
}

export const CSVDownload: Dataset = {
  meta: {
    title: 'New Dataset from Workflow'
  },
  transform: {
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
  ds.set_body(csv, parse_as='csv')`}
    ]
  }
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
    { syntax: 'starlark', category: 'transform', name: 'transform', script: 'def transform(ds,ctx):\n\tds.set_body([[1,2,3],[4,5,6]])' }
  ],
  hooks: [
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
    { syntax: 'starlark', category: 'transform', name: 'transform', script: 'def transform(ds,ctx):\n\tds.set_body([[1,2,3],[4,5,6]])' }
  ],
  hooks: [
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
    { syntax: 'starlark', category: 'transform', name: 'transform', script: 'def transform(ds,ctx):\n\tds.set_body([[1,2,3],[4,5,6]])' }
  ],
  hooks: [
    { type: 'push', remote: 'https://registry.qri.cloud' }
  ]
}

export const Templates: Record<string, Workflow> = {
  'CSVDownload': CSVDownload,
  'APICall': APICall,
  'DatabaseQuery': DatabaseQuery,
  'Webscrape': Webscrape,
  'Blank': Blank
}

export function selectTemplate(id: string): Workflow {
  return Templates[id]
}
