import React from "react";

import { NewRunStep, Run } from "../../qri/run";
import Dataset, { TransformStep } from "../../qri/dataset";
import Icon from "../../chrome/Icon";
import RunStatusIcon from "../run/RunStatusIcon";

interface WorkflowCellsStatusProps {
  run?: Run
  dataset: Dataset
}

const WorkflowCellsStatus: React.FC<WorkflowCellsStatusProps> = ({
 run,
 dataset
}) => {

  return (
    <div className='mb-1'>
      {dataset?.transform?.steps && dataset.transform.steps.map((step: TransformStep, i: number) => {
        let r
        if (run) {
          r = (run?.steps && run?.steps.length >= i && run.steps[i]) ? run.steps[i] : NewRunStep({ status: "waiting" })
        }
        return (
          <div key={i} className='flex items-center justify-between mb-1.5'>
            <div className='bg-white rounded-md px-2 w-20 h-6 flex items-center'>
              <Icon size='2xs' icon='code'/>
            </div>
            {r && r.status && <RunStatusIcon status={r.status} />}
          </div>
        )
      })}
    </div>
  )
}

export default WorkflowCellsStatus
