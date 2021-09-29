import { Workflow } from '../../qrimatic/workflow'
import Dataset from "../../qri/dataset";

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
    qri: '',
    title: 'New Dataset from Workflow'
  },
  username: '',
  name: '',
  path: '',
  transform: {
    qri: '',
    steps: [
      {
        name: 'intro-step',
        syntax: 'starlark',
        category: 'intro-step',
        script: `# Welcome to the Qri Workflow Editor!
# This script lives with your new dataset, and will be used to create new versions of the dataset
# Start writing Starlark code here...

print('Hello, World!')

# To write your transform script, you need to do a few things:
# - Import raw data from an http request, database connection, or another Qri Dataset
# - Manipulate/Transform the data to get it into the shape you want
# - Commit your transformed data to create a new version of this dataset

# Lifelines:
# Jump into our Discord Server to get live coding help
# Starlark Documentation: qri.io/docs
# Transform Code Snippet Library: qri.io/docs
`
      },
      {
        name: 'download-example',
        syntax: 'starlark',
        category: 'download-example',
        script: `# CSV Download Code Sample
# This really works! Click 'Dry Run' to try it ↗

# import dependencies
load("http.star", "http") # \`http\` lets us talk to the internets
load("dataframe.star", "dataframe") # \`dataframe\` gives us powerful dataset manipulation capabilities

# with dependencies loaded, download a CSV
# this fetches a "popular baby names" dataset from the NYC Open Data Portal
csvDownloadUrl = "https://data.cityofnewyork.us/api/views/25th-nujf/rows.csv?accessType=DOWNLOAD"
rawCSV = http.get(csvDownloadUrl).body()

# parse the CSV (string) into a qri DataFrame
theData = dataframe.parse_csv(rawCSV)

# we can do filtering of the DataFrame and assign it back to its original variable
# filter for first names that start with 'V'
theData = theData[[x.startswith('V') for x in theData["Child's First Name"]]]

# each column in the DataFrame is a Series
# make a new \`Series\` with only the unique values
uniqueSeries = theData["Child's First Name"].unique()

# iterate over the Series and convert each string to lowercase
for idx, val in enumerate(uniqueSeries):
    uniqueSeries[idx] = val.lower()

# sort the Series alphabetically
uniqueSeries = sorted(uniqueSeries)

# make an empty DataFrame, assign our Series to be a column named 'firstname'
# this will become the next version of our dataset's body
newBody = dataframe.DataFrame()
newBody['firstname'] = uniqueSeries

# get the previous version of this dataset
workingDataset = dataset.latest()
# set the body of the dataset to be our new body
workingDataset.body = newBody

# finally, commit the changes
# the last step of every transform is always \`dataset.commit(Dataset)\`
dataset.commit(workingDataset)
`
      },
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
