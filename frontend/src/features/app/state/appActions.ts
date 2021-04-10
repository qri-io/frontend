import { Modal, ModalType, SET_MODAL, TOGGLE_NAV_EXPANDED } from "./appState";

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

export function toggleNavExpanded() {
  return {
    type: TOGGLE_NAV_EXPANDED,
  }
}
