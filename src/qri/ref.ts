// import { RouteComponentProps } from 'react-router-dom'

import { ComponentName } from "./dataset"

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
  // human-readble name of the owner of this dataset
  username: string
  // user identifier
  profileId?: string
  // dataset name
  name: string
  // commit hash, eg: /ipfs/QmY9WcXXUnHJbYRA28LRctiL4qu4y...
  path?: string
  // optional: a specific component the user is trying to index into component
  component?: ComponentName
  // address into dataset structure
  selector?: string[]
}

export function newQriRef (d: Record<string, any>): QriRef {
  let path = d.path
  if (!path && d.fs && d.hash !== "") {
    path = `/${d.fs}/${d.hash}`
  }

  let selector = d.selector
  if (typeof selector === 'string') {
    selector = [selector]
  }

  return {
    username: d.username || d.peername,
    profileId: d.profileId,
    name: d.name,
    path,
    component: d.component,
    selector
  }
}

// TODO(b5): this function should be applied to the selector field of QriRef
export function selectorFromLocationHash (location: Record<string, any>): ComponentName {
  if (location?.hash) {
    const hashValue = location.hash.split('#')[1]
    // only set component if it's a valid qri component name
    if (['body', 'meta', 'structure', 'readme', 'transform'].includes(hashValue)) {
      return hashValue
    }
  }
  return 'body'
}

// parses the selected component from the location hash and appends it to params
// params can be any object that would normally be passed to newQriRef
// location is the result of useLocation
export function refParamsFromLocation (params: Record<string, any>, location: Record<string, any>): Record<string, any> {
  return {
    ...params,
    component: selectorFromLocationHash(location)
  }
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
// if the string does not follow either strict formatting, return an empty
// reference
export function qriRefFromString (refString: string): QriRef {
  let parts = refString.split('/')
  if (parts.length === 0) {
    return { username: '', name: '' }
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
  return { username: '', name: '' }
}

// checks if qriRef has location, username, and name
export function qriRefIsEmpty (qriRef: QriRef): boolean {
  return !qriRef.username || qriRef.username === '' || !qriRef.name || qriRef.name === ''
}

// checks if the two given qriRefs refer to the same dataset
// aka, have the same username and name
export function qriRefIsSameDataset (a: QriRef, b: QriRef): boolean {
  return a.username === b.username && a.name === b.name
}

// humanRef creates a new qri ref with only the username/name part of a refence
// dropping any path or identifier data
export function humanRef (ref: QriRef): QriRef {
  return newQriRef({ username: ref.username, name: ref.name })
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
