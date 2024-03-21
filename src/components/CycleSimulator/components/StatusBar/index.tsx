// 当前角色状态栏，只用来展示
import React from 'react'
import {
  CycleSimulatorLog,
  ShowCycleSingleSkill,
  模拟DPS结果,
  模拟信息类型,
} from '../../simulator/type'

import Jian from './jian'
import Buff from './buff'
import './index.css'
import DpsRes from './dpsRes'
import Chongwu from './chongwu'

interface StatusBarProps {
  模拟信息: 模拟信息类型
  完整循环: ShowCycleSingleSkill[]
  日志信息: CycleSimulatorLog[]
  模拟DPS结果: 模拟DPS结果
}

function StatusBar(props: StatusBarProps) {
  const { 模拟信息, 日志信息, 模拟DPS结果 } = props

  return (
    <div className={'cycle-status-bar'}>
      <Jian 角色状态信息={模拟信息?.角色状态信息} />
      <Chongwu 当前宠物数据={模拟信息?.当前宠物数据} 当前时间点={模拟信息?.当前时间} />
      <Buff
        title="自身Buff"
        buff列表={模拟信息?.当前自身buff列表}
        当前时间点={模拟信息?.当前时间}
      />
      <Buff
        title="目标Buff"
        buff列表={模拟信息?.当前目标buff列表}
        DOT列表={模拟信息?.当前DOT运行状态}
        当前时间点={模拟信息?.当前时间}
      />
      <DpsRes 模拟信息={模拟信息} 日志信息={日志信息} 模拟DPS结果={模拟DPS结果} />
    </div>
  )
}

export default StatusBar
