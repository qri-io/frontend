import { RootState } from '../../../store/store';
import { createReducer } from '@reduxjs/toolkit'
import { ModalAction } from './appActions';

export const SET_MODAL = 'SET_MODAL'
export const TOGGLE_NAV_EXPANDED = 'TOGGLE_NAV_EXPANDED'

export const selectModal = (state: RootState): Modal => state.app.modal
export const selectNavExpanded = (state: RootState) => state.app.navExpanded

export enum ModalType {
  none = '',
  schedulePicker = 'schedulePicker',
  unsavedChanges = 'unsavedChanges',
  deployWorkflow = 'deployWorkflow',
  removeDataset = 'removeDataset',
  logIn = 'logIn',
  signUp = 'signUp',
  workflowSplash = 'workflowSplash'
}

export interface Modal<P = {}> {
  type: ModalType
  props?: P
}

export interface AppState {
  modal: Modal,
  navExpanded: Boolean
}

const initialState: AppState = {
  modal: { type: ModalType.none },
  navExpanded: true
}

export const appReducer = createReducer(initialState, {
  SET_MODAL: (state: AppState, action: ModalAction) => {
    state.modal = action.modal
  },

  TOGGLE_NAV_EXPANDED: (state: AppState) => {
    state.navExpanded = !state.navExpanded
  }
})
