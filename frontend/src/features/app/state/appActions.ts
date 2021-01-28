import { Modal, ModalType, SET_MODAL } from "./appState";

export interface ModalAction {
  type: string
  modal: Modal
}

export function showModal<P = {}>(type: ModalType, props?: P): ModalAction {
  return {
    type: SET_MODAL,
    modal: {
      type,
      props
    }
  }
}

export function clearModal(): ModalAction {
  return {
    type: SET_MODAL,
    modal: { type: ModalType.none }
  }
}
