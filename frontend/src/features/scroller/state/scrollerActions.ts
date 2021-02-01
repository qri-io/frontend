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

export interface SetScrollElementAction {
  type: string
  scrollElement: string
}

 export function setScrollElement(scrollElement: string): SetScrollElementAction {
  return {
    type: SET_SCROLL_ELEMENT,
    scrollElement
  }
}