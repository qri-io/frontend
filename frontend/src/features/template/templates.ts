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
  ds.set_body(csv, parse_as='csv')`}
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
    { syntax: 'starlark', category: 'transform', name: 'transform', script: 'def transform(ds,ctx):\n\tds.set_body([[1,2,3],[4,5,6]])' }
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
    { syntax: 'starlark', category: 'transform', name: 'transform', script: 'def transform(ds,ctx):\n\tds.set_body([[1,2,3],[4,5,6]])' }
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
    { syntax: 'starlark', category: 'setup', name: 'setup', script: '# load starlark dependencies\nload("http.star", "http")\nload("encoding/csv.star", "csv")\nload("bsoup.star", "bsoup")\nload("time.star", "time")' },
    { syntax: 'starlark', category: 'download', name: 'download', script: '# get some html to scrape\ndef download(ctx):\n  url = "https://www.epochconverter.com/"\n  return http.get(url).body()' },
    { syntax: 'starlark', category: 'transform', name: 'transform', script: `# leftPad() pads input with zeroes, takes int or string as input
def leftPad(input, length):
  # convert int to string
  if type(input) == 'int':
    input = str(input)
  padded = input
  for i in range(len(input), length):
    padded = '0' + padded
  return padded

# given a time struct, returns an ISO8601 date+time string
def getISOTimestamp(t):
  year = leftPad(t.year(), 4)
  month = leftPad(t.month(), 2)
  day = leftPad(t.day(), 2)
  hour = leftPad(t.hour(), 2)
  minute = leftPad(t.minute(), 2)
  second = leftPad(t.second(), 2)
  return '{}-{}-{}T{}:{}:{}'.format(year, month, day, hour, minute, second)

def transform(ds, ctx):
  # parse body with bsoup
  soup = bsoup.parseHtml(ctx.download)

  # find element with id "ecclock", its contents are a unix timestamp for now
  epoch = soup.find(id="ecclock").get_text()

  # timestamp is a time struct
  timestamp = time.fromtimestamp(int(epoch))

  # convert time struct into ISO8601 string
  humanReadable = getISOTimestamp(timestamp)

  # create a header row, append a single row of data
  csv = 'unix_epoch, timestamp\\n'
  csv += epoch + ',' + humanReadable

  # use the csv string to set the body of the qri dataset
  ds.set_body(csv, parse_as='csv')
          ` }
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
