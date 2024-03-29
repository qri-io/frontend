import { Modal, ModalPosition, ModalType, SET_MODAL, SET_MODAL_LOCKED, TOGGLE_NAV_EXPANDED } from "./appState"

export interface ModalAction {
  type: string
  modal: Modal
  locked?: boolean
}

export interface ModalLockedAction {
  type: string
  locked: boolean
}

export function showModal<P = {}> (type: ModalType, props?: P, customWidth: boolean = false, position?: ModalPosition): ModalAction {
  return {
    type: SET_MODAL,
    modal: {
      type,
      props,
      customWidth,
      position
    }
  }
}

export function clearModal (): ModalAction {
  return {
    type: SET_MODAL,
    modal: { type: ModalType.none }
  }
}

export function setModalLocked (locked: boolean): ModalLockedAction {
  return {
    type: SET_MODAL_LOCKED,
    locked
  }
}

export function toggleNavExpanded () {
  return {
    type: TOGGLE_NAV_EXPANDED
  }
}
