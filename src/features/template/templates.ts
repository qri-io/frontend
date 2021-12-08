// @ts-nocheck
import { Workflow } from '../../qrimatic/workflow'
import Dataset from "../../qri/dataset"

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
  ds.set_body(csv, parse_as='csv')` }
  ],
  hooks: [
    { type: 'push', remote: 'https://registry.qri.cloud' }
  ]
}

export const CSVDownload: Dataset = {
  meta: {
    qri: '',
    title: 'New Automated Dataset'
  },
  username: '',
  name: '',
  path: '',
  transform: {
    qri: '',
    steps: [
      {
        name: 'download-template',
        syntax: 'starlark',
        category: 'download-example',
        script: `# CSV Download Sample Code | click 'Dry Run' to try it ↗

# import dependencies
load("http.star", "http")
load("dataframe.star", "dataframe")

# download CSV file
csv_download_url = "https://data.cityofnewyork.us/api/views/25th-nujf/rows.csv?accessType=DOWNLOAD"
raw_csv = http.get(csv_download_url).body()

# parse the CSV (string) into a qri DataFrame
the_data = dataframe.parse_csv(raw_csv)

# get the previous version of this dataset
working_dataset = dataset.latest()

# set the body of the dataset to be our DataFrame
working_dataset.body = the_data

# commit the dataset
dataset.commit(working_dataset)
`
      }
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

export function selectTemplate (id: string): Workflow {
  return Templates[id]
}
