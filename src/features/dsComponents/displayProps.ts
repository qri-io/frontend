import { ComponentName } from '../../qri/dataset'

export interface ComponentDisplayProps {
  name: ComponentName,
  displayName: string,
  tooltip: string,
  icon: string
}

const displayProps: Record<ComponentName,ComponentDisplayProps> = {
  'commit': {
    name: 'commit',
    displayName: 'Commit',
    tooltip: 'info about the latest changes to the dataset',
    icon: 'commit'
  },
  'readme': {
    name: 'readme',
    displayName: 'Readme',
    tooltip: 'a markdown file to familiarize people with the dataset',
    icon: 'readme'
  },
  'meta': {
    name: 'meta',
    displayName: 'Meta',
    tooltip: 'the dataset\'s title, description, tags, etc',
    icon: 'tags'
  },
  'body': {
    name: 'body',
    displayName: 'Body',
    tooltip: 'the structured content of the dataset',
    icon: 'body'
  },
  'structure': {
    name: 'structure',
    displayName: 'Structure',
    tooltip: 'the structure of the dataset',
    icon: 'structure'
  },
  'transform': {
    name: 'transform',
    displayName: 'Transform',
    tooltip: 'commit automation',
    icon: 'transform'
  },
  'viz': {
    name: 'viz',
    displayName: 'Viz',
    tooltip: 'dataset visualization',
    // TODO(b5) - pick icon
    icon: 'unknown'
  },
  'stats': {
    name: 'stats',
    displayName: 'Stats',
    tooltip: 'dataset aggregate statistics',
    // TODO(b5) - pick icon
    icon: 'unknown'
  }
}

export default displayProps
