import React from 'react'
import { Link } from 'react-router-dom'
import ReactDataTable from 'react-data-table-component'

import DurationFormat from '../../chrome/DurationFormat'
import RelativeTimestamp from '../../chrome/RelativeTimestamp'
import Icon from '../../chrome/Icon'
import DatasetCommitInfo from '../../chrome/DatasetCommitInfo'
import RunStatusBadge from '../run/RunStatusBadge'
import { LogItem } from '../../qri/log'
import { customStyles, customSortIcon } from '../../features/collection/CollectionTable'
import { runEndTime } from '../../utils/runEndTime'

import { NewDataset, NewCommit } from '../../qri/dataset'
import MonacoEditor from "react-monaco-editor/lib/editor"
import { MONACO_EDITOR_OPTIONS } from "../workflow/CodeEditor"

interface ActivityListProps {
  log: LogItem[]
  showDatasetName?: boolean
  containerHeight: number
}

const propCode: string = '!/bin/sh\n' +
  'set -e\n' +
  '\n' +
  'Workaround old docker images with incorrect $HOME\n' +
  'check docker/docker: Issue #2968 for details\n' +
  'then\n' +
  'export HOME=$(getent passwd $(id -un) | cut -d: -f6)\n' +
  'fi\n' +
  '\n' +
  'echo "Using SSH Config Dir \'$SSH_CONFIG_DIR\'"\n' +
  'git --version\n' +
  '\n' +
  'mkdir -p "$SSH_CONFIG_DIR"\n' +
  '\n' +
  'echo \'github.com ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAq2A7hRGmdnm9tUDbO9IDSwBK6TbQa+PXYPCPy6rbTrTtw7PHkccKrpp0yVhp5HdEIcKr6pLlVDBfOLX9QUsyCOV0wzfjIJNlGEYsdlLJizHhbn2mUjvSAHQqZETYP81eFzLQNnPHt4EVVUh7VfDESU84KezmD5QlWpXLmvU31/yMf+Se8xhHTvKSCZIFImWwoG6mbUoWf9nzpIoaSjB+weqqUUmpaaasXVal72J+UX2B+2RPW3RcT0eOzQgqlJL3RKrTJvdsjE3JEAvGq3lGHSZXy28G3skua2SmVi/w4yCE6gbODqnTWlg7+wC604ydGXA8VJiS5ap43JXiUFFAaQ==\n' +
  'bitbucket.org ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAubiN81eDcafrgMeLzaFPsw2kNvEcqTKl/VqLat/MaB33pZy0y3rJZtnqwR2qOOvbwKZYKiEO1O6VqNEBxKvJJelCq0dTXWT5pbO2gDXC6h6QDXCaHo6pOHGPUy+YBaGQRGuSusMEASYiWunYN0vCAI8QaXnWMXNMdFP3jHAJH0eDsoiGnLPBlBp4TNm6rYI74nMzgz3B9IikW4WVK+dc8KZJZWYjAuORU3jc1c/NPskD2ASinf8v3xnfXeukU0sJ5N6m5E8VLjObPEO+mN2t/FZTMZLiFqPWc/ALSqnMnnhwrNi2rbfg/rd/IpL8Le3pSBne8+seeFVBoGqzHM9yXw==\n' +
  '\' >> $SSH_CONFIG_DIR/known_hosts\n' +
  '\n' +
  '(umask 077; touch "$SSH_CONFIG_DIR/id_rsa")\n' +
  'chmod 0600 "$SSH_CONFIG_DIR/id_rsa"\n' +
  '(cat <<EOF > "$SSH_CONFIG_DIR/id_rsa"\n' +
  '$CHECKOUT_KEY\n' +
  'EOF\n' +
  ')\n' +
  '\n' +
  'export GIT_SSH_COMMAND=\'ssh -i "$SSH_CONFIG_DIR/id_rsa" -o UserKnownHostsFile="$SSH_CONFIG_DIR/known_hosts"\'\n' +
  '\n' +
  'use git+ssh instead of https\n' +
  'git config --global url."ssh://git@github.com".insteadOf "GitHub: Where the world builds software" || true\n' +
  'git config --global gc.auto 0 || true\n' +
  '\n' +
  'if [ -e \'/home/circleci/repo/.git\' ] ; then\n' +
  'echo \'Fetching into existing repository\'\n' +
  'existing_repo=\'true\'\n' +
  'cd \'/home/circleci/repo\'\n' +
  'git remote set-url origin "$CIRCLE_REPOSITORY_URL" || true\n' +
  'else\n' +
  'echo \'Cloning git repository\'\n' +
  'existing_repo=\'false\'\n' +
  'mkdir -p \'/home/circleci/repo\'\n' +
  'cd \'/home/circleci/repo\'\n' +
  'git clone --no-checkout "$CIRCLE_REPOSITORY_URL" .\n' +
  'fi\n' +
  '\n' +
  'if [ "$existing_repo" = \'true\' ] || [ \'false\' = \'true\' ]; then\n' +
  'echo \'Fetching from remote repository\'\n' +
  'if [ -n "$CIRCLE_TAG" ]; then\n' +
  'git fetch --force --tags origin\n' +
  'else\n' +
  'git fetch --force origin \'+refs/heads/master:refs/remotes/origin/master\'\n' +
  'fi\n' +
  'fi\n'

const ActivityList: React.FC<ActivityListProps> = ({
  log,
  showDatasetName = true,
  containerHeight
}) => {
  // react-data-table column definitions
  const columns = [
    {
      name: 'Status',
      selector: (row: LogItem) => row.runStatus,
      width: '200px',
      // eslint-disable-next-line react/display-name
      cell: (row: LogItem) => <RunStatusBadge status={row.runStatus} />
    },
    {
      name: 'name',
      selector: (row: LogItem) => row.name,
      grow: 2,
      omit: !showDatasetName,
      // eslint-disable-next-line react/display-name
      cell: (row: LogItem) => {
        const { username, name } = row
        return (
          <div className='hover:text-qrilightblue hover:underline'>
            <Link to={`/${username}/${name}`}>{username}/{name}</Link>
          </div>
        )
      }
    },
    {
      name: 'Time',
      selector: (row: LogItem) => row.runStart,
      width: '180px',
      // eslint-disable-next-line react/display-name
      cell: (row: LogItem) => {
        const runEnd = runEndTime(row.runStart, row.runDuration)
        return (
          <div className='text-qrigray-400 flex flex-col text-sm'>
            <div className='mb-1'>
              {runEnd ? <RelativeTimestamp timestamp={runEnd} /> : <div className='w-full'>--</div> }
            </div>
            <div className='flex items-center'>
              <Icon icon='clock' size='2xs' className='mr-1' />
              <DurationFormat seconds={Math.ceil(row.runDuration / 1000000000)} />
            </div>
          </div>
        )
      }
    },
    {
      name: 'Commit',
      selector: (row: LogItem) => row.commitMessage,
      width: '180px',
      // eslint-disable-next-line react/display-name
      cell: (row: LogItem) => {
        if (!['failed', 'unchanged', 'running'].includes(row.runStatus)) {
          const versionLink = `/${row.username}/${row.name}/at${row.path}/history/body`
          return (
            <Link to={versionLink} className='min-w-0 flex-grow'>
              <DatasetCommitInfo item={row} small inRow />
            </Link>
          )
        } else {
          return <div className='w-full'>--</div>
        }
      }
    }
  ]

  const conditionalRowStyles = [
    {
      when: (row: LogItem) => row.runStatus === 'running',
      classNames: ['animate-appear', 'overflow-hidden', 'min-height-0-important'],
      style: {
        height: 58
      }
    }
  ]

  const ExpandableComponent = (data: any) => (
    <div className='px-12'>
      <div className='rounded-xl overflow-hidden animate-appear min-height-0'>
        <MonacoEditor options={{ ...MONACO_EDITOR_OPTIONS, readOnly: true }} onChange={() => {}} value={propCode} theme='vs-dark' width="100%" height="384" />
      </div>
    </div>
  )
  // borrows styles and icons from CollectionTable
  return (
    <ReactDataTable
      columns={columns}
      data={log}
      customStyles={customStyles}
      fixedHeader
      expandableRows
      expandOnRowClicked
      expandableRowsHideExpander
      expandableRowsComponent={() => <ExpandableComponent />}
      conditionalRowStyles={conditionalRowStyles}
      fixedHeaderScrollHeight={`${String(containerHeight)}px`}
      noHeader
      style={{
        background: 'blue'
      }}
      defaultSortField='name'
      sortIcon={customSortIcon}
    />
  )
}

export default ActivityList
