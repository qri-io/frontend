import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store';
import { SetScrollerPosAction, SetScrollElementAction } from './scrollerActions';

export const SET_SCROLLER_POS = 'SET_SCROLLER_POS'
export const SET_SCROLL_ELEMENT = 'SET_SCROLL_ELEMENT' 

export interface ScrollerState {
  // scrollPos, when this changes it triggers the workflow editor to adjust it's scroll position
  scrollerPos: number
  // scrollElement is the name of the `ScrollTo` component that we want to show
  // up in view
  scrollElement: string
}

export const selectScrollerPos = (state: RootState): number => state.scroller.scrollerPos

export const selectScrollElement = (state: RootState): string => state.scroller.scrollElement


const initialState: ScrollerState = {
  scrollerPos: 0,
  scrollElement: ''
}

export const scrollerReducer = createReducer(initialState, {
  SET_SCROLLER_POS: (state: ScrollerState, action: SetScrollerPosAction) => {
    state.scrollerPos = action.scrollerPos
  },
  SET_SCROLL_ELEMENT: (state: ScrollerState, action: SetScrollElementAction) => {
    state.scrollElement = action.scrollElement
  },
})
