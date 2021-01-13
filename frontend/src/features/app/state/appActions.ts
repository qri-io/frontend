import { AppModalType, SET_MODAL } from "./appState";


export interface ModalAction {
  type: string
  modal: AppModalType
}

export function showModal(modal: AppModalType): ModalAction {
  return {
    type: SET_MODAL,
    modal
  }
}

export function clearModal(): ModalAction {
  return {
    type: SET_MODAL,
    modal: AppModalType.none,
  }
}
