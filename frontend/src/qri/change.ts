
// ChangeStatus enumerates the all possible state shifts in dataset components 
// between two versions of a dataset
export enum ChangeStatus {
  nonexistant = 0,
  unchanged = 1,
  added = 2,
  removed = 3,
  modified = 4
}