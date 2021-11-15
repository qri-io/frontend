import { RootState } from '../../../store/store'
import { createReducer } from '@reduxjs/toolkit'
import { ModalAction, ModalLockedAction } from './appActions'

export const SET_MODAL = 'SET_MODAL'
export const SET_MODAL_LOCKED = 'SET_MODAL_LOCKED'
export const TOGGLE_NAV_EXPANDED = 'TOGGLE_NAV_EXPANDED'

export const selectModal = (state: RootState): Modal => state.app.modal
export const selectNavExpanded = (state: RootState): boolean => state.app.navExpanded

export enum ModalType {
  none = '',
  schedulePicker = 'schedulePicker',
  unsavedChanges = 'unsavedChanges',
  deployWorkflow = 'deployWorkflow',
  removeDataset = 'removeDataset',
  editDatasetTitle = 'editDatasetTitle',
  logIn = 'logIn',
  signUp = 'signUp',
  workflowSplash = 'workflowSplash',
  deploy = 'deploy',
  addTrigger = 'addTrigger'
}

export interface ModalPosition {
  top: string
  left: string
  position: 'relative' | 'absolute'
}

export interface Modal<P = {}> {
  type: ModalType
  // locked is used to block closing the modal when clicking outside of it or
  // when pressing 'esc'
  locked?: boolean
  props?: P
  customWidth?: boolean
  position?: ModalPosition
}

export interface AppState {
  modal: Modal
  navExpanded: boolean
}

const initialState: AppState = {
  modal: { type: ModalType.none, locked: false },
  navExpanded: true
}

export const appReducer = createReducer(initialState, {
  SET_MODAL: (state: AppState, action: ModalAction) => {
    state.modal = action.modal
  },

  SET_MODAL_LOCKED: (state: AppState, action: ModalLockedAction) => {
    state.modal.locked = action.locked
  },

  TOGGLE_NAV_EXPANDED: (state: AppState) => {
    state.navExpanded = !state.navExpanded
  }
})
