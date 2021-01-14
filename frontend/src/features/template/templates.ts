import { Workflow } from '../../qrimatic/workflow'

// TODO (ramfox): need to formalize possible trigger & on completion types

export const CSVDownload:  Workflow = {
  id: 'CSVDownload',
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

export const APICall:  Workflow = {
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

export const DatabaseQuery:  Workflow = {
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

export const Webscrape:  Workflow = {
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