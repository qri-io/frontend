import { RootState } from '../../../store/store';
import { createReducer } from '@reduxjs/toolkit'
import { ModalAction } from './appActions';

export const SET_MODAL = 'SET_MODAL'

export const selectModalType = (state: RootState): AppModalType => state.app.modal

export enum AppModalType {
  none = '',
  schedulePicker = 'schedulePicker',
  deployWorkflow = 'deployWorkflow'
}

export interface AppState {
  modal: AppModalType,
}

const initialState: AppState = {
  modal: AppModalType.none
}

export const appReducer = createReducer(initialState, {
  SET_MODAL: setModal,
})

function setModal(state: AppState, action: ModalAction) {
  state.modal = action.modal
  return
}
