import React from 'react'
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faBolt, faProjectDiagram, faPlus } from '@fortawesome/free-solid-svg-icons'


import { showModal } from '../app/state/appActions';
import { AppModalType } from '../app/state/appState';
import Block from './Block';

const triggerItems = [
  {
    name: 'Run on a Schedule',
    description: 'Run the workflow every day at 11:30am',
    icon: faClock
  },
  {
    name: 'Run when another dataset is updated',
    description: 'The workflow will run whenever b5/world_bank_population is updated',
    icon: faProjectDiagram
  },
  {
    name: 'Run with a webhook',
    description: 'The workflow will run when this webhook is called: https://qrimatic.qri.io/my-dataset',
    icon: faBolt
  },
]

const Triggers: React.FC<any> = () => {
  const dispatch = useDispatch();
  return (
    <section className='p-4'>
      <div>
        <div className='text-2xl font-semibold text-gray-600 mb-1 inline-block'>Triggers</div>
        <div className='float-right border py-1 px-2 rounded'><FontAwesomeIcon icon={faPlus} /></div>
      </div>
      <div className='text-xs mb-3'>Customize your workflow to execute on a schedule, or based on other events</div>
      <div className='grid grid-flow-col grid-cols-3 -mx-2 overflow-hidden'>
        {triggerItems.map((d, i) => <Block key={i} {...d} onClick={() => { dispatch(showModal(AppModalType.schedulePicker))}} />)}
      </div>
    </section>
    )
}

export default Triggers;
