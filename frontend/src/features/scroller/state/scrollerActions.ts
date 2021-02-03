import { SET_SCROLLER_POS, SET_SCROLL_ELEMENT } from "./scrollerState";

export interface SetScrollerPosAction {
  type: string
  scrollerPos: number
}

 export function setScrollerPos(scrollerPos: number): SetScrollerPosAction {
  return {
    type: SET_SCROLLER_POS,
    scrollerPos,
  }
}

export interface SetScrollAnchorAction {
  type: string
  id: string
}

 export function setScrollAnchor(id: string): SetScrollAnchorAction {
  return {
    type: SET_SCROLL_ELEMENT,
    id
  }
}