import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store';
import { SetScrollerPosAction, SetScrollAnchorAction } from './scrollerActions';

// SCROLLER_DEFAULT_TOP_OFFSET how far from the top of the scroller
// to place the scrolled element by default
export const SCROLLER_DEFAULT_TOP_OFFSET = 80

export const SET_SCROLLER_POS = 'SET_SCROLLER_POS'
export const SET_SCROLL_ELEMENT = 'SET_SCROLL_ELEMENT'
export const RESET_SCROLLER = 'RESET_SCROLLER'

export interface ScrollerState {
  // scrollPos, when this changes it triggers the workflow editor to adjust it's
  // scroll position
  scrollerPos: number
  // scrollAnchorID is the id of an anchor tag in the `ScrollTo` component that
  // we want to show up in view
  scrollAnchorID: string
}

export const selectScrollerPos = (state: RootState): number => state.scroller.scrollerPos

export const selectScrollAnchorID = (state: RootState): string => state.scroller.scrollAnchorID


const initialState: ScrollerState = {
  scrollerPos: 0,
  scrollAnchorID: ''
}

export const scrollerReducer = createReducer(initialState, {
  SET_SCROLLER_POS: (state: ScrollerState, action: SetScrollerPosAction) => {
    state.scrollerPos = action.scrollerPos
  },
  SET_SCROLL_ELEMENT: (state: ScrollerState, action: SetScrollAnchorAction) => {
    state.scrollAnchorID = action.id
  },
  RESET_SCROLLER: () => {
    return initialState
  }
})
