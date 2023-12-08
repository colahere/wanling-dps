import { CycleSimulatorLog, 全部唤灵印数据模型 } from '@/@types/cycleSimulator'
import { 属性系数 } from '@/data/constant'

import 循环模拟技能基础数据, { 宠物数据 } from '@/data/cycleSimulator/skill'
import { 获取加速等级 } from '@/utils/help'
import { BUFF持续最大时间 } from './constant'

interface SimulatorCycleProps {
  测试循环: string[]
  加速值: number
  网络按键延迟: number
  测试宠物顺序: string[]
  奇穴: string[]
  满承契起手: boolean
}

// 开始模拟
export const SimulatorCycle = (props: SimulatorCycleProps): CycleSimulatorLog[] => {
  const { 测试循环, 加速值, 网络按键延迟, 测试宠物顺序, 奇穴, 满承契起手 } = props
  const 初始时间 = -35 - 网络按键延迟

  // 正读条技能，无读条技能，GCD加速值
  // 逆读条引导技能的加速要额外计算
  const 加速等级 = 获取加速等级(加速值)

  let 当前箭带内箭数 = 8
  let 开始释放上一个技能的时间 = 初始时间
  // let 当前时间 = 0 // 从0开始计算时间，按帧计算
  let 当前时间 = 初始时间 // 从0开始计算时间，按帧计算
  let 召唤宠物索引 = -1 // 上次召唤完的索引
  let 当前标鹄层数 = 0
  let 战斗日志: CycleSimulatorLog[] = []
  const 唤灵印状态时间集: 全部唤灵印数据模型 = { 虎: [], 鹰: [], 猪: [], 象: [], 熊: [], 狼: [] }

  const 桑柘 = 奇穴?.includes('桑柘')
  const 贯侯 = 奇穴?.includes('贯侯')
  const 棘矢 = 奇穴?.includes('棘矢')
  const 朱厌 = 奇穴?.includes('朱厌')
  const 九乌 = 奇穴?.includes('九乌')
  const 于狩 = 奇穴?.includes('于狩')
  const 诸怀 = 奇穴?.includes('诸怀')
  const 孰湖 = 奇穴?.includes('孰湖')

  // 增加时间
  const 增加时间 = (time) => {
    当前时间 = 当前时间 + (time > 0 ? time : 0 || 0)
  }

  // 释放寒更晓箭
  const 释放寒更晓箭 = () => {
    当前箭带内箭数 = 8
    添加战斗日志({
      日志: `开始换箭 - 寒更晓箭`,
      日志类型: '释放技能',
      日志时间: 当前时间,
    })
    开始释放上一个技能的时间 = 当前时间
    增加时间(16)
    添加战斗日志({
      日志: `换箭完成 - 寒更晓箭`,
      日志类型: '技能释放结果',
      日志时间: 当前时间,
    })
  }

  // 添加战斗日志
  const 添加战斗日志 = (log) => {
    战斗日志 = [...(战斗日志 || []), log]
  }

  // 上一层贯穿
  const 上一层贯穿 = (技能名称, 当前事件时间?) => {
    添加战斗日志({
      日志: `${技能名称}`,
      日志类型: '上贯穿',
      日志时间: 当前事件时间 !== undefined ? 当前事件时间 : 当前时间,
    })
  }

  // 消耗箭
  const 消耗箭 = (当前技能, 消耗, 当前事件时间?) => {
    const 新箭数 = 当前箭带内箭数 - 消耗
    当前箭带内箭数 = 新箭数 > 0 ? 新箭数 : 0
    添加战斗日志({
      日志: `${当前技能?.技能名称} 使【箭】变为 ${新箭数}`,
      日志类型: '消耗箭',
      日志时间: (当前事件时间 || 当前时间) + 1,
    })
  }

  // 判断是否需要等待GCD，发还需要等待的时间
  const 判断是否需要等待GCD和技能CD = (当前技能, 上一个技能, 技能索引) => {
    const 释放下一个技能实际所需GCD =
      开始释放上一个技能的时间 + (上一个技能?.技能释放后添加GCD - 加速等级 || 0)

    // 判断连续技能GCD
    if (释放下一个技能实际所需GCD > 当前时间) {
      增加时间(释放下一个技能实际所需GCD - 当前时间)
    }

    // 判断相同技能CD
    if (当前技能?.技能CD) {
      // 在日志里找到上一次释放此技能的时间
      const newLog = [...战斗日志]
      newLog.reverse()
      const 上一次释放本技能时间 = newLog?.find(
        (item) =>
          (item?.日志 === `${当前技能?.技能名称}` || item?.日志?.includes(当前技能?.技能名称)) &&
          item?.日志类型 === '释放技能'
      )?.日志时间

      const 实际CD =
        朱厌 && 当前技能.技能名称 === '弛律召野' ? 当前技能?.技能CD + 20 * 16 : 当前技能?.技能CD

      // 判断CD是否够用
      if (上一次释放本技能时间) {
        const newTime = 上一次释放本技能时间 + 实际CD
        // GCD还没好，等待转好
        if (newTime > 当前时间) {
          添加战斗日志({
            日志: `${当前技能?.技能名称}_${技能索引}_等技能CD${newTime - 当前时间}帧`,
            日志类型: '等CD',
            日志时间: newTime,
          })
          增加时间(newTime - 当前时间)
        }
      }
    }
  }

  // 标鹄触发
  const 标鹄触发 = (当前事件时间) => {
    // 判断贯侯
    const 标鹄引爆后基础层数 = 贯侯 ? 2 : 1
    if (当前标鹄层数 + 1 === 5) {
      // 标鹄上贯穿
      上一层贯穿('标鹄', 当前事件时间)
      // 红箭标鹄额外上一层（疑似bug）
      上一层贯穿('标鹄', 当前事件时间)
      if (桑柘) {
        // 桑柘标鹄额外上一层贯穿
        上一层贯穿('标鹄', 当前事件时间)
      }
      添加战斗日志({
        日志: `标鹄`,
        日志类型: '造成伤害',
        日志时间: 当前事件时间,
        buff列表: 贯侯 ? ['贯侯'] : [],
      })
    }
    当前标鹄层数 = 当前标鹄层数 + 1 > 4 ? 标鹄引爆后基础层数 : 当前标鹄层数 + 1
    添加战斗日志({
      日志: `标鹄【层数】变为 ${当前标鹄层数}`,
      日志类型: '目标buff变动',
      日志时间: 当前事件时间,
    })
  }

  // 上承契
  const 上承契 = (当前事件时间?) => {
    添加战斗日志({
      日志: `获得承契buff`,
      日志类型: '自身buff变动',
      日志时间: 当前事件时间 || 当前时间,
    })
  }

  // 召唤宠物
  const 召唤宠物 = (唤灵印是否会消失 = false) => {
    // 释放召唤后延迟1秒（16帧）宠物才造成伤害
    const 本次事件召唤索引 = 召唤宠物索引 + 1 > 5 ? 召唤宠物索引 + 1 - 5 - 1 : 召唤宠物索引 + 1
    const 本次召唤宠物 = 测试宠物顺序[本次事件召唤索引]
    const 本次召唤宠物数据 = 宠物数据[本次召唤宠物]

    // 添加唤灵印buff时间
    // 驰律召唤的幻灵印10秒后会消失，引风召唤的则不会消失
    唤灵印状态时间集[本次召唤宠物].push([
      当前时间,
      唤灵印是否会消失 ? 当前时间 + 16 * 10 : BUFF持续最大时间,
    ])

    // 添加宠物进入场地日志
    添加战斗日志({
      日志: `${测试宠物顺序[本次事件召唤索引]}-宠物`,
      日志类型: '宠物进入场地',
      日志时间: 当前时间 + 本次召唤宠物数据?.释放后进入场景时间,
    })
    // 添加宠物造成伤害日志
    // 鹰上贯穿
    const 初次造成伤害时间 = 当前时间 + 本次召唤宠物数据?.释放后攻击时间
    // 鹰默认上4次
    if (测试宠物顺序[本次事件召唤索引] === '鹰') {
      for (let m = 0; m < 4; m++) {
        添加战斗日志({
          日志: `${测试宠物顺序[本次事件召唤索引]}-宠物`,
          日志类型: '上贯穿',
          日志时间: 初次造成伤害时间,
        })
      }
    }
    // 添加宠物伤害
    if (本次召唤宠物数据?.宠物攻击次数) {
      // 狼造成三次伤害
      for (let m = 0; m < 本次召唤宠物数据?.宠物攻击次数; m++) {
        添加战斗日志({
          日志: `${测试宠物顺序[本次事件召唤索引]}-宠物`,
          日志类型: '造成伤害',
          日志时间: 初次造成伤害时间 + m * (本次召唤宠物数据?.宠物攻击频率 || 0),
        })
      }
    } else {
      添加战斗日志({
        日志: `${测试宠物顺序[本次事件召唤索引]}-宠物`,
        日志类型: '造成伤害',
        日志时间: 初次造成伤害时间,
      })
    }
    // 宠物离开场地前上承契
    上承契(当前时间 + 本次召唤宠物数据?.释放后退场时间 - 4) // 每个宠物离场地前上承契的buff时间都不一样，暂时写死
    // 孰湖可以让宠物自带2层承契，可以上两次承契
    if (孰湖) {
      上承契(当前时间 + 本次召唤宠物数据?.释放后退场时间 - 4) // 每个宠物离场地前上承契的buff时间都不一样，暂时写死
    }
    // 添加宠物进入场地日志
    添加战斗日志({
      日志: `${测试宠物顺序[本次事件召唤索引]}-宠物`,
      日志类型: '宠物离开场地',
      日志时间: 当前时间 + 本次召唤宠物数据?.释放后退场时间,
    })
    召唤宠物索引 = 本次事件召唤索引
  }

  // 第一次循环，不包含引爆贯穿
  for (let i = 0; i < 测试循环?.length; i++) {
    const 当前技能 = 循环模拟技能基础数据?.find((item) => item?.技能名称 === 测试循环[i])
    // 判断是否为当前箭袋第一个技能
    const 上一个技能 =
      当前箭带内箭数 === 8 && 当前时间 !== 初始时间
        ? '寒更晓箭'
        : 循环模拟技能基础数据?.find((item) => item?.技能名称 === 测试循环[i - 1])

    // 判断是否需要等待GCD
    if (i > 0) {
      判断是否需要等待GCD和技能CD(当前技能, 上一个技能, i)
    }
    增加时间(网络按键延迟)
    // 开始释放技能
    添加战斗日志({
      日志: `${当前技能?.技能名称}`,
      日志类型: '释放技能',
      日志时间: 当前时间,
    })
    开始释放上一个技能的时间 = 当前时间
    if (于狩 && 当前技能?.技能名称 === '没石饮羽') {
      上承契()
    }
    if (当前技能?.造成伤害次数) {
      // 多段伤害计数
      if (当前技能?.初次伤害频率 || 当前技能?.伤害频率) {
        if (当前技能?.技能名称 !== '弛风鸣角' && 当前技能?.消耗箭数) {
          消耗箭(当前技能, 当前技能?.消耗箭数)
        }

        // 造成伤害
        for (let k = 0; k < 当前技能?.造成伤害次数; k++) {
          // const 频率计算 = 当前技能?.是否为读条技能 ? -加速等级 : 0
          // 实际初次频率 - 目前看 初次伤害频率 不吃加速
          const 实际初次频率 = 当前技能.初次伤害频率 || 0
          // 实际伤害频率
          const 实际伤害频率 = 获取实际帧数(当前技能?.伤害频率, 加速值)
          // 没有初次伤害频率的第一次直接用伤害频率计算
          const 当前事件时间 = 当前时间 + 实际初次频率 + 实际伤害频率 * (实际初次频率 ? k : k + 1)

          // 触发标鹄
          标鹄触发(当前事件时间)
          // 破招触发
          if (当前技能?.是否上破招) {
            添加战斗日志({
              日志: `破`,
              日志类型: '造成伤害',
              日志时间: 当前事件时间,
            })
          }
          if (当前技能?.是否上贯穿) {
            上一层贯穿(当前技能?.技能名称, 当前事件时间)
          }
          添加战斗日志({
            日志: `${当前技能?.技能名称} - ${k + 1}`,
            日志类型: '造成伤害',
            日志时间: 当前事件时间,
          })

          // 单独处理弛风的消耗，每次伤害消耗一次
          if (当前技能?.技能名称 === '弛风鸣角') {
            消耗箭(当前技能, 1, 当前事件时间)
          }
        }
        // 单段伤害计数
      } else {
        // 触发标鹄
        标鹄触发(当前时间)
        // 破招触发
        if (当前技能?.是否上破招) {
          添加战斗日志({
            日志: `破`,
            日志类型: '造成伤害',
            日志时间: 当前时间,
          })
        }
        if (当前技能?.是否上贯穿) {
          上一层贯穿(当前技能?.技能名称)
        }
        添加战斗日志({
          日志: `${当前技能?.技能名称}`,
          日志类型: '造成伤害',
          日志时间: 当前时间,
        })

        if (当前技能?.消耗箭数) {
          消耗箭(当前技能, 当前技能?.消耗箭数)
        }
      }
    }
    if (当前技能?.召唤宠物) {
      const 唤灵印是否会消失 = 当前技能?.技能名称 === '弛律召野'
      召唤宠物(唤灵印是否会消失)
      if (朱厌 && 当前技能?.技能名称 === '弛律召野') {
        召唤宠物(唤灵印是否会消失)
        召唤宠物(唤灵印是否会消失)
      }
      if (诸怀 && 当前技能?.技能名称 === '引风唤灵') {
        上承契()
      }
    }
    // 读条时间受加速影响
    if (当前技能?.是否为读条技能) {
      const 读条时间 = 获取实际帧数(当前技能.伤害频率, 加速值) * 当前技能.造成伤害次数
      增加时间(
        读条时间 > 当前技能?.技能释放后添加GCD - 加速等级
          ? 读条时间
          : 当前技能?.技能释放后添加GCD - 加速等级
      )
    } else {
      增加时间((当前技能?.技能释放后添加GCD || 0) - 加速等级)
    }
    // 释放技能结束
    // 判断箭数量
    // 最后一轮箭就不换箭了
    if (当前箭带内箭数 === 0 && i !== 测试循环.length - 1) {
      释放寒更晓箭()
    }
  }

  // 添加唤灵印象馆技能处理后日志
  const 处理唤灵印相关后日志: CycleSimulatorLog[] = 唤灵印处理日志加入(
    战斗日志,
    唤灵印状态时间集,
    九乌
  )

  // 把引爆贯穿根据造成伤害时箭的位置判断，塞入对应引爆触发
  const 添加引爆贯穿日志: CycleSimulatorLog[] = 引爆贯穿日志加入(处理唤灵印相关后日志, 棘矢)
  // 开始分析贯穿
  const 添加贯穿后日志: CycleSimulatorLog[] = 贯穿分析(添加引爆贯穿日志, 加速等级, 桑柘)
  // 添加普通攻击
  const 添加普通攻击后日志: CycleSimulatorLog[] = 普通攻击日志(添加贯穿后日志)

  const 添加承契后日志: CycleSimulatorLog[] = 承契分析(添加普通攻击后日志, 满承契起手)

  const 最终日志 = [...添加承契后日志]

  最终日志.sort((a, b) => {
    return a?.日志时间 - b?.日志时间
  })

  return 最终日志
}

// 添加唤灵印象馆技能处理后日志
const 唤灵印处理日志加入 = (
  战斗日志: CycleSimulatorLog[],
  唤灵印状态时间集: 全部唤灵印数据模型,
  九乌
) => {
  let 战斗日志副本 = [...战斗日志]
  const 实际穿灵印持续时间: 全部唤灵印数据模型 = { 虎: [], 鹰: [], 猪: [], 象: [], 熊: [], 狼: [] }

  // 添加战斗日志
  const 添加战斗日志 = (log) => {
    战斗日志副本 = [...(战斗日志副本 || []), log]
  }

  // 先处理唤灵印的时间集，整理出真正buff的持续时间
  Object.keys(唤灵印状态时间集).forEach((宠物) => {
    const 当前时间集 = 唤灵印状态时间集[宠物]
    let 处理印记时间副本: number[] = []
    for (let i = 0; i < 当前时间集.length; i++) {
      // 当本次循环发现 处理印记时间副本 的时间已经过去，则说明时间段不会更新，把它加入实际穿灵印持续时间
      if (当前时间集[i][0] > 处理印记时间副本[1]) {
        实际穿灵印持续时间[宠物].push(处理印记时间副本)
        处理印记时间副本 = []
      }
      if (!处理印记时间副本[0]) {
        处理印记时间副本[0] = 当前时间集[i][0]
      }
      if (当前时间集[i][1] !== BUFF持续最大时间 || 当前时间集[i][0] <= 处理印记时间副本[1]) {
        处理印记时间副本[1] = 当前时间集[i][1]
      }
      // 处理最后一个数据
      if (i === 当前时间集.length - 1) {
        // 如果没有传入结束时间则认为buff持续到永久
        const 结束时间 = 处理印记时间副本[1] || BUFF持续最大时间
        实际穿灵印持续时间[宠物].push([处理印记时间副本[0], 结束时间])
      }
    }
  })

  // 把唤灵印的实际持续时间塞入
  Object.keys(实际穿灵印持续时间).forEach((宠物) => {
    实际穿灵印持续时间[宠物].forEach((时间段) => {
      添加战斗日志({
        日志: `获得唤灵印【${宠物}】`,
        日志类型: '自身buff变动',
        日志时间: 时间段[0],
      })
      if (时间段[1] !== BUFF持续最大时间) {
        添加战斗日志({
          日志: `唤灵印消失【${宠物}】`,
          日志类型: '自身buff变动',
          日志时间: 时间段[1],
        })
      }
    })
  })

  // 九乌
  if (九乌) {
    // 获取所有宠物造成伤害的日志时间
    const 宠物造成伤害的日志 = 战斗日志.filter(
      (item) => item.日志?.includes('-宠物') && item.日志类型 === '造成伤害'
    )

    宠物造成伤害的日志.forEach((日志) => {
      // 判断本次造成伤害的时间是否存在飞行唤灵印印记（鹰）
      const 鹰唤灵印持续时间 = 实际穿灵印持续时间['鹰']
      if (
        鹰唤灵印持续时间?.some((时间段) => 日志.日志时间 > 时间段[0] && 日志.日志时间 <= 时间段[1])
      ) {
        // 九乌上两次贯穿
        添加战斗日志({
          日志: 日志?.日志,
          日志类型: '上贯穿',
          日志时间: 日志.日志时间,
        })
        添加战斗日志({
          日志: 日志?.日志,
          日志类型: '上贯穿',
          日志时间: 日志.日志时间,
        })
      }
    })
  }

  战斗日志副本.sort((a, b) => {
    return a?.日志时间 - b?.日志时间
  })

  return 战斗日志副本
}

/**
 * 引爆贯穿日志加入
 */
const 引爆贯穿日志加入 = (战斗日志: CycleSimulatorLog[], 棘矢) => {
  // 点了棘矢才有引爆贯穿
  if (棘矢) {
    let 战斗日志副本 = [...战斗日志]
    // const 引爆贯穿时间点日志数组: CycleSimulatorLog[] = []

    const 消耗箭0和1的时间区间 = 战斗日志副本
      ?.filter(
        (item) =>
          item?.日志类型 === '消耗箭' && (item?.日志?.includes('0') || item?.日志?.includes('1'))
      )
      .map((item) => {
        return {
          ...item,
          箭: item?.日志?.includes('0') ? 0 : 1,
        }
      })

    // 添加战斗日志
    const 添加前置战斗日志 = (log) => {
      // 将日志塞到前列
      // 找到日志中和新log相同时间的第一个索引
      const index = 战斗日志副本?.findIndex((item) => item?.日志时间 === log?.日志时间)
      // 存在相同时间
      if (index) {
        const newLog = [...战斗日志副本]
        newLog.splice(index, 0, log)
        // 战斗日志 = [...newLog]
        战斗日志副本 = newLog.map((item) => item)
      } else {
        战斗日志副本 = [...(战斗日志副本 || []), log]
      }
    }

    // 第二次循环，判断引爆贯穿情况，添加引爆贯穿数据
    // 注意这里要循环的是 战斗日志 而不是 战斗日志副本，因为战斗日志副本会不断被增加导致死循环
    for (let i = 0; i < 战斗日志?.length; i++) {
      const 当前日志 = 战斗日志[i]
      // 当前技能
      const 当前技能 = 循环模拟技能基础数据?.find((item) =>
        当前日志?.日志?.includes(item?.技能名称)
      )

      if (当前日志?.日志类型 === '造成伤害' && 当前技能?.是否引爆贯穿) {
        for (let j = 0; j < 消耗箭0和1的时间区间?.length; j++) {
          if (
            j % 2 === 0 &&
            当前日志?.日志时间 > 消耗箭0和1的时间区间[j]?.日志时间 - 1 &&
            当前日志?.日志时间 <= 消耗箭0和1的时间区间[j + 1]?.日志时间 - 1 &&
            消耗箭0和1的时间区间[j]?.箭 === 1 &&
            消耗箭0和1的时间区间[j + 1]?.箭 === 0
          ) {
            添加前置战斗日志({
              日志: `${当前技能?.技能名称}`,
              日志类型: '引爆贯穿',
              日志时间: 当前日志?.日志时间,
            })
          }
        }
      }
    }
    return [...战斗日志副本]
  } else {
    return 战斗日志
  }
}

/**
 * 贯穿分析
 */

const 贯穿分析 = (战斗日志: CycleSimulatorLog[], 加速等级, 桑柘) => {
  let 当前贯穿层数 = 0
  // 这里换一个思路处理，将待生效的贯穿塞入一个待处理数组。先不管她。在下一次上贯穿、引爆触发的时候判断后。去更新待生效贯穿数组，根据时间判断哪些是生效哪些需要更新时间
  let 待生效贯穿: 待生效贯穿[] = []
  // let 最后一次贯穿buff消失时间 = 0

  // 桑柘多上一次贯穿
  const 单次上贯穿次数 = 桑柘 ? 5 : 4
  // const 单次上贯穿次数 = 桑柘 ? 2 : 1
  let 战斗日志副本 = [...战斗日志]
  const 贯穿日志 = 战斗日志.filter((item) => item?.日志类型?.includes('贯穿'))

  贯穿日志.sort((a, b) => {
    return a?.日志时间 - b?.日志时间
  })

  const 添加战斗日志 = (log) => {
    战斗日志副本 = [...(战斗日志副本 || []), log]
  }
  for (let i = 0; i < 贯穿日志?.length; i++) {
    const 当前事件 = 贯穿日志?.[i]
    if (当前事件) {
      // 将生效时间前的贯穿跳完
      for (let j = 0; j < 待生效贯穿?.length; j++) {
        const 当前贯穿 = 待生效贯穿[j]
        // 有8帧buff消失时间
        if (当前贯穿?.生效时间 < 当前事件?.日志时间) {
          添加战斗日志({
            日志: `贯穿【${当前贯穿层数}】- DOT`,
            日志类型: '造成伤害',
            日志时间: 当前贯穿?.生效时间,
          })
        }
      }

      // 先判断是不是所有贯穿已经跳完
      if (待生效贯穿?.[待生效贯穿.length - 1]?.生效时间 < 当前事件?.日志时间) {
        添加战斗日志({
          日志: `贯穿Buff消失`,
          日志类型: '目标buff变动',
          日志时间: 待生效贯穿?.[待生效贯穿.length - 1]?.生效时间,
        })
        当前贯穿层数 = 0
        // 最后一次贯穿buff消失时间 = 待生效贯穿?.[待生效贯穿.length - 1]?.生效时间
        待生效贯穿 = []
      }

      // 从待处理列表中移除已生效的贯穿
      待生效贯穿 = 待生效贯穿.filter((item) => item?.生效时间 >= 当前事件?.日志时间)

      if (当前事件?.日志类型 === '上贯穿') {
        let 续贯穿第一次生效时间 =
          (待生效贯穿[待生效贯穿?.length - 1]?.生效时间 || 当前事件?.日志时间) + 8

        // 当前没有贯穿buff
        if (!待生效贯穿?.length) {
          // 续贯穿第一次生效时间 = (当前事件?.日志时间 > 0 ? 当前事件?.日志时间 : 0) + 8
          续贯穿第一次生效时间 = 当前事件?.日志时间 + 8 + 4
          // 以下为测试推导的续dot原理，应该还有很多问题，需要优化
          // 第一次上贯穿
          // if (i === 0) {
          //   // 这里不知道为什么第一次生效的时间不一样。可能只是样本数据差异
          //   续贯穿第一次时间 = 桑柘 ? 8 : 4
          //   // 当上贯穿时dot刚消失不到4帧
          // } else if (当前事件?.日志时间 - 最后一次贯穿buff消失时间 <= 4) {
          //   续贯穿第一次时间 = 最后一次贯穿buff消失时间 + 32 - 24 + 4
          //   // 当上buff时间 - 最后一次的时间已经超过8帧（0.5秒）
          // } else if (当前事件?.日志时间 - 最后一次贯穿buff消失时间 >= 7) {
          //   续贯穿第一次时间 =
          //     当前事件?.日志时间 + 32 + 当前事件?.日志时间 - 最后一次贯穿buff消失时间 - 24 - 4
          // } else {
          //   续贯穿第一次时间 = 最后一次贯穿buff消失时间 + 16
          // }
        }
        // 目前测试不吃加速。8帧一次
        const DOT单跳间隔 = 8
        for (let k = 0; k < 5; k++) {
          if (待生效贯穿?.length < 单次上贯穿次数) {
            待生效贯穿 = [
              ...(待生效贯穿 || []),
              {
                生效时间: 续贯穿第一次生效时间 + DOT单跳间隔 * k,
              },
            ]
          }
        }
        当前贯穿层数 = 当前贯穿层数 + 1 > 6 ? 6 : 当前贯穿层数 + 1
      } else if (当前事件?.日志类型 === '引爆贯穿') {
        if (当前贯穿层数 && 待生效贯穿?.length) {
          添加战斗日志({
            日志: `${当前事件?.日志}成功触发【棘矢】引爆贯穿【${当前贯穿层数}】`,
            日志类型: '技能释放结果',
            日志时间: 当前事件?.日志时间,
          })
          添加战斗日志({
            日志: `贯穿【${当前贯穿层数}】- 引爆`,
            日志类型: '造成伤害',
            日志时间: 当前事件?.日志时间,
          })
        } else {
          添加战斗日志({
            日志: `${当前事件?.日志}触发【棘矢】失败，当前无可引爆贯穿`,
            日志类型: '技能释放结果',
            日志时间: 当前事件?.日志时间,
          })
        }
      }
    }
  }

  // 触发贯穿日志循环结束，把剩余贯穿跳完
  // for (let j = 0; j < 待生效贯穿?.length; j++) {
  //   const 当前贯穿 = 待生效贯穿[j]
  //   添加战斗日志({
  //     日志: `贯穿【${当前贯穿层数}】- DOT`,
  //     日志类型: '造成伤害',
  //     日志时间: 当前贯穿?.生效时间,
  //   })
  // }

  const 结果日志 = [...战斗日志副本]

  结果日志.sort((a, b) => {
    return a?.日志时间 - b?.日志时间
  })

  return 结果日志
}

// 普通攻击日志
const 普通攻击日志 = (战斗日志: CycleSimulatorLog[]) => {
  const 所有释放技能数组: any = 战斗日志.filter((item) => {
    return item?.日志类型 === '释放技能'
  })
  // 读条期间不释放普通攻击
  const 找出所有读条技能的区间: Array<{ 开始时间: number; 结束时间: number; 是否读条: boolean }> =
    所有释放技能数组
      .map((item, index) => {
        const 当前技能 = 循环模拟技能基础数据?.find((a) => a?.技能名称 === item?.日志)
        return {
          开始时间: item?.日志时间,
          结束时间: 所有释放技能数组[index + 1]
            ? 所有释放技能数组[index + 1]?.日志时间
            : item?.日志时间,
          是否读条: 当前技能?.是否为读条技能,
        }
      })
      .filter((item: any) => {
        return item?.是否读条
      })
  const 战斗最大时间 = 战斗日志[战斗日志?.length - 1]?.日志时间

  const 战斗日志副本 = [...战斗日志]

  const 普通攻击时间列表: number[] = []

  for (let i = 0; i < 战斗最大时间; i++) {
    // 判断攻击间隔，最小24帧一次
    if (
      (普通攻击时间列表[普通攻击时间列表.length - 1] || 0) + 24 <= i ||
      !普通攻击时间列表?.length
    ) {
      // 判断本帧是否在读条技能时间内
      if (!找出所有读条技能的区间?.some((item) => item?.开始时间 < i && item?.结束时间 > i)) {
        普通攻击时间列表.push(i)
      }
    }
  }

  普通攻击时间列表.forEach((item) => {
    战斗日志副本.push({
      日志: `风矢`,
      日志类型: '造成伤害',
      日志时间: item,
    })
  })

  战斗日志副本.sort((a, b) => {
    return a?.日志时间 - b?.日志时间
  })

  return 战斗日志副本
}

// 承契分析
const 承契分析 = (战斗日志: CycleSimulatorLog[], 满承契起手: boolean) => {
  let 当前承契层数 = 满承契起手 ? 5 : 0
  let 上一次承契buff消失时间 = 0

  let 战斗日志副本 = [...战斗日志]

  const 添加战斗日志 = (log) => {
    战斗日志副本 = [...(战斗日志副本 || []), log]
  }

  for (let i = 0; i < 战斗日志副本.length; i++) {
    // 判断上一个buff是不是已经消失了
    if (i !== 0 && 战斗日志副本[i]?.日志时间 > 上一次承契buff消失时间) {
      添加战斗日志({
        日志: `承契buff消失`,
        日志类型: '自身buff变动',
        日志时间: 上一次承契buff消失时间,
      })
      当前承契层数 = 0
    }
    if (战斗日志副本[i]?.日志 === '获得承契buff') {
      当前承契层数 = 当前承契层数 + 1 > 5 ? 5 : 当前承契层数 + 1
      添加战斗日志({
        日志: `承契buff变为【${当前承契层数}】层`,
        日志类型: '自身buff变动',
        日志时间: 战斗日志副本[i]?.日志时间,
      })
      // 承契buff18秒 288帧
      上一次承契buff消失时间 = 战斗日志副本[i]?.日志时间 + 288
    }

    // 当前为造成伤害时，判断承契层数
    if (战斗日志副本[i]?.日志类型 === '造成伤害' && 当前承契层数) {
      战斗日志副本[i].buff列表 = [`承契_${当前承契层数}层`, ...(战斗日志副本[i]?.buff列表 || [])]
    }
  }

  战斗日志副本.sort((a, b) => {
    return a?.日志时间 - b?.日志时间
  })

  return 战斗日志副本
}

interface 待生效贯穿 {
  生效时间: number // 生效时间（帧）
}

// a0层后上贯穿buff时间 b 最后一次贯穿时间
// function test(a, b) {
//   if (a - b <= 0.25) {
//     return b + 2 + 0.25 - 1.5
//   } else if (a - b > 0.49) {
//     return a + 2 + a - b - 0.25 - 1.5
//   } else {
//     return b + 1
//   }
// }

// 读条技能的实际帧数
export const 获取实际帧数 = (原始帧数, 加速值) => {
  return Math.floor((1024 * 原始帧数) / (Math.floor((1024 * 加速值) / 属性系数?.急速) + 1024))
}
