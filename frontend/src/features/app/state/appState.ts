import { RootState } from '../../../store/store';
import { createReducer } from '@reduxjs/toolkit'
import { ModalAction } from './appActions';

export const SET_MODAL = 'SET_MODAL'

export const selectModal = (state: RootState): Modal => state.app.modal

export enum ModalType {
  none = '',
  schedulePicker = 'schedulePicker',
  deployWorkflow = 'deployWorkflow',
  removeDataset = 'removeDataset'
}

export interface Modal<P = {}> {
  type: ModalType
  props?: P
}

export interface AppState {
  modal: Modal,
}

const initialState: AppState = {
  modal: { type: ModalType.none },
}

export const appReducer = createReducer(initialState, {
  SET_MODAL: setModal,
})

function setModal(state: AppState, action: ModalAction) {
  state.modal = action.modal
  return
}
