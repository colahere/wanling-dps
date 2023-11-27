import React from 'react'
import { CycleSimulatorLog } from '@/@types/cycleSimulator'
import { Modal, ModalProps, Table } from 'antd'
import 循环模拟技能基础数据, { 日志类型数组 } from '@/data/cycleSimulator/skill'
import './index.css'

interface BattleLogModalProps extends ModalProps {
  logData: CycleSimulatorLog[]
}

const BattleLogModal: React.FC<BattleLogModalProps> = (props) => {
  const { open, onCancel, logData } = props

  const columns = [
    {
      title: '日志',
      dataIndex: '日志',
      filters: [...循环模拟技能基础数据, { 技能名称: '贯穿' }]?.map((item) => {
        return {
          text: item?.技能名称,
          value: item?.技能名称,
        }
      }),
      onFilter: (value: any, record) => {
        return record.日志?.includes(value) || record?.日志类型?.includes(value)
      },
    },
    {
      title: '日志类型',
      dataIndex: '日志类型',
      filters: 日志类型数组?.map((item) => {
        return {
          text: item,
          value: item,
        }
      }),
      onFilter: (value: any, record) => record.日志类型.indexOf(value) === 0,
    },
    {
      title: '日志帧',
      dataIndex: '日志时间',
      render: (_) => {
        return _
      },
    },
    {
      title: '日志秒',
      dataIndex: '日志秒',
      render: (_, row) => {
        return row?.日志时间 / 16
      },
    },
  ]

  return (
    <Modal
      className="cycle-simulator-modal"
      open={open}
      onCancel={onCancel}
      title={
        <div className={'cycle-simulator-modal-header'}>
          <h1 className={'cycle-simulator-modal-title'}>战斗日志</h1>
          {/* <span style={{ margin: '0 12px' }}>
            贯穿数量{' '}
            {
              (logData || [])?.filter((item) => {
                return item?.日志?.includes('- DOT') || item?.日志?.includes('- 引爆')
              })?.length
            }
          </span> */}
          {/* <Button onClick={() => setCountModal(true)}>技能统计</Button> */}
        </div>
      }
      width={'80%'}
      centered
      footer={false}
    >
      <Table
        dataSource={logData}
        columns={columns}
        size="small"
        pagination={{ pageSize: 100, showTotal: (total) => total }}
      />
    </Modal>
  )
}

export default BattleLogModal
