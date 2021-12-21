// @ts-nocheck
import Dataset from "../../qri/dataset"

export const CSVDownload: Dataset = {
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

export const Templates: Record<string, Dataset> = {
  'CSVDownload': CSVDownload
}

export function selectTemplate (id: string): Workflow {
  return Templates[id]
}
