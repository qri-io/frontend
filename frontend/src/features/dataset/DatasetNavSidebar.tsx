import React from 'react'
import { QriRef } from '../../qri/ref'
import SideNavItem from './SideNavItem'

export interface DatasetNavSidebarProps {
  qriRef: QriRef
}

const DatasetNavSidebar: React.FC<DatasetNavSidebarProps> = ({ qriRef }) => (
  <div className='side-nav border-r border-1 h-full'>
    <SideNavItem icon='code' to={`/ds/${qriRef.username}/${qriRef.name}`} />
    <SideNavItem icon='table' to={`/ds/${qriRef.username}/${qriRef.name}/components`}/>
    <SideNavItem icon='clock' to={`/ds/${qriRef.username}/${qriRef.name}/history`}/>
  </div>
)

export default DatasetNavSidebar
