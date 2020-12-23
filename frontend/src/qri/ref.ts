// import { RouteComponentProps } from 'react-router-dom'

// QriRef models a reference to a user, dataset, or part of a dataset within Qri
// We use "QriRef" instead of "Ref" to disambiguate with the react "ref"
// property.
//
// QriRef are structured expansions of a reference string, breaking elements of
// a reference into fields. For example the following reference string:
//
// foo/bar/at/ipfs/QmFme0d/body
//
// expands to the ref:
//   {
//     location: foo/bar/at/ipfs/QmFme0d/body
//     username: foo
//     name: bar
//     path: /ipfs/QmFme0d
//     component: body
//   }
//
// refs can also be partially-applied. for example the reference string:
//
//   foo/bar
//
// expands to
//
//   {
//     location: foo/bar
//     username: foo
//     name: bar
//   }
//
// refs are often parsed from URL strings, reference strings take one of two
// general forms:
//
// 1. an alias reference string: [username]/[name]/at[path]/[selector]
// 2. an "identifier reference string: [identifier]/at[path]/[selector]
export interface QriRef {
  // string this ref parsed from
  location?: string
  // human-readble name of the owner of this dataset
  username: string
  // user identifier
  profileId?: string
  // dataset name
  name: string
  // commit hash, eg: /ipfs/QmY9WcXXUnHJbYRA28LRctiL4qu4y...
  path?: string
  // optional: a specific component the user is trying to index into component
  component?: string
  // address into dataset structure
  selector?: string
}

// // qriRefFromRoute parses route props into a Ref
// export function qriRefFromRoute (p: RouteComponentProps): QriRef {
//   const selectedComponent = selectedComponentFromLocation(p.location.pathname)
//   let path
//   if (p.match.params.path) {
//     path = '/ipfs/' + p.match.params.path
//   }
//   return {
//     location: p.location.pathname,

//     username: p.match.params.username || '',
//     name: p.match.params.name || '',
//     path: path,
//     component: p.match.params.component ? p.match.params.component : selectedComponent,
//     selector: p.match.params.selector
//   }
// }

// refStringFromQriRef takes a qriRef and turns it into a ref string, the optional
// `useAtSymbol` param, when true, will use the `@` symbol rather than the url safe
// `/at`
export function refStringFromQriRef (qriRef: QriRef, useAtSymbol?: boolean): string {
  let route = `${qriRef.username}/${qriRef.name}`
  if (qriRef.path) {
    if (useAtSymbol) {
      route += `@${qriRef.path}`
    } else {
      route += `/at${qriRef.path}`
    }
  }
  return route
}

// qriRefFromString takes a string and turns it into a qriRef
// based on two possible formats for the ref strings:
// [username]/[name]@/[network]/[path]
// [username]/[name]
// if the string does not follow either strict formatting, we return `undefined`
export function qriRefFromString (refString: string): QriRef | undefined {
  let parts = refString.split('/')
  if (parts.length === 0) {
    return undefined
  }
  if (parts[0] === '/') {
    parts = parts.slice(1)
  }
  if (parts.length === 2) {
    return { username: parts[0], name: parts[1] }
  }
  if (refString.includes('@') && parts.length === 4) {
    return { username: parts[0], name: parts[1].slice(0, parts[1].length - 1), path: `/${parts[2]}/${parts[3]}` }
  }

  if (refString.includes('/at/') && parts.length === 5) {
    return { username: parts[0], name: parts[1], path: `/${parts[3]}/${parts[4]}` }
  }
  return undefined
}

// checks if qriRef has location, username, and name
export function qriRefIsEmpty (qriRef: QriRef): boolean {
  return !qriRef.location || qriRef.location === '' || !qriRef.username || qriRef.username === '' || !qriRef.name || qriRef.name === ''
}

// checks if the two given qriRefs refer to the same dataset
// aka, have the same username and name
export function qriRefIsSameDataset (a: QriRef, b: QriRef): boolean {
  return a.username === b.username && a.name === b.name
}

// // selectedComponentFromQriRef takes a qriRef and gets the selected component
// // from the location param
// export function selectedComponentFromLocation (location: string): SelectedComponent | undefined {
//   if (location.endsWith('/body')) {
//     return 'body'
//   }
//   if (location.endsWith('/transform')) {
//     return 'transform'
//   }
//   if (location.endsWith('/structure')) {
//     return 'structure'
//   }
//   if (location.endsWith('/readme')) {
//     return 'readme'
//   }
//   if (location.endsWith('/commit')) {
//     return 'commit'
//   }
//   if (location.endsWith('/meta')) {
//     return 'meta'
//   }
//   return undefined
// }

// isDatasetSelected determines if the user has selected a dataset to view
export function isDatasetSelected (qriRef: QriRef): boolean {
  return !!qriRef.username && !!qriRef.name
}
