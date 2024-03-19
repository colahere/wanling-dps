/**
 * 定义模拟循环类
 */

import { 获取加速等级 } from '@/utils/help'
import 技能原始数据 from '@/data/skill'
import { 每秒郭氏帧 } from '../constant'
import {
  ERROR_ACTION,
  根据奇穴修改buff数据,
  根据奇穴修改技能数据,
  起手承契BUFF,
  转化buff和增益名称,
} from './utils'

import {
  技能GCD组,
  技能类实例集合,
  检查运行数据实例类型,
  Buff枚举,
  CycleSimulatorLog,
  CycleSimulatorSkillDTO,
  角色状态信息类型,
  技能释放记录数据,
  待生效事件,
  当前宠物数据,
} from './type'

import 劲风簇 from './技能类/劲风簇'
import 触发橙武 from './技能类/触发橙武'
import 贯穿 from './DOT类/贯穿'
import 白羽流星 from './技能类/白羽流星'
import 弛风鸣角 from './技能类/弛风鸣角'
import 没石饮羽 from './技能类/没石饮羽'
import 朝仪万汇 from './技能类/朝仪万汇'
import 宠物 from './通用类/宠物'
import 引风唤灵 from './技能类/引风唤灵'
import 弛律召野 from './技能类/弛律召野'
import 寒更晓箭 from './技能类/寒更晓箭'
import 金乌见坠 from './技能类/金乌见坠'
import 饮羽簇 from './技能类/饮羽簇'
import { 宠物基础数据 } from '../constant/skill'

export interface SimulatorCycleProps {
  测试循环: string[]
  加速值: number
  网络延迟: number
  奇穴: string[]
  宠物顺序: string[]
  起手承契: number
  大橙武模拟: boolean
  角色状态信息?: 角色状态信息类型
}

class 循环主类 {
  循环执行结果: '成功' | '异常' = '成功'
  循环异常信息 = { 异常索引: 0, 异常信息: '' }
  测试循环: string[] = []
  奇穴: string[] = []
  加速等级 = 0
  网络延迟 = 0
  // 网络按键延迟 = 0
  角色状态信息: 角色状态信息类型 = {
    箭数: 8,
    箭形态: '红箭',
  }
  当前自身buff列表: Buff枚举 = {}
  当前目标buff列表: Buff枚举 = {}
  当前时间 = 0
  开始释放上一个技能的时间 = 0
  战斗日志: CycleSimulatorLog[] = []
  技能释放记录: 技能释放记录数据[] = []
  Buff和Dot数据: Buff枚举 = {}
  技能基础数据: CycleSimulatorSkillDTO[] = []
  GCD组: 技能GCD组 = {
    公共: 0,
    自身: 0,
  }
  技能类实例集合: 技能类实例集合 = {}
  风矢上次造成伤害时间: number | undefined = undefined
  大橙武模拟 = false
  待生效事件队列: 待生效事件[] = []
  // 宠物相关
  宠物序列: string[] = []
  召唤宠物索引 = -1 // 上次召唤完的索引
  当前宠物数据: 当前宠物数据 = {}

  // 初始化创建
  constructor(props: SimulatorCycleProps) {
    // 模拟开始后不会变动的数据
    this.测试循环 = props.测试循环
    this.大橙武模拟 = props.大橙武模拟
    this.奇穴 = props.奇穴
    this.加速等级 = 获取加速等级(props.加速值)
    this.网络延迟 = props.网络延迟
    // 根据奇穴和装备情况修改buff的数据
    this.Buff和Dot数据 = 根据奇穴修改buff数据(this.奇穴)
    // 根据奇穴和装备情况修改技能的数据
    this.技能基础数据 = 根据奇穴修改技能数据(this.奇穴)

    this.当前自身buff列表 = props.起手承契
      ? { ...起手承契BUFF(this.Buff和Dot数据, props.起手承契) }
      : {}
    this.当前目标buff列表 = {}
    this.角色状态信息 = {
      箭数: 8,
      箭形态: '红箭',
    }
    this.待生效事件队列 = []
    // 初始化宠物数据
    this.宠物序列 = props.宠物顺序 || Object.keys(宠物基础数据)

    // 模拟初始化
    this.初始化技能实例类()
    this.重置循环执行结果()
  }

  // ----------------- 通用函数 start----------------- //
  重置循环执行结果() {
    this.循环执行结果 = '成功'
    this.循环异常信息 = { 异常索引: 0, 异常信息: '' }
  }

  初始化技能实例类() {
    this.技能类实例集合 = {
      劲风簇: new 劲风簇(this),
      饮羽簇: new 饮羽簇(this),
      贯穿: new 贯穿(this),
      白羽流星: new 白羽流星(this),
      弛风鸣角: new 弛风鸣角(this),
      没石饮羽: new 没石饮羽(this),
      朝仪万汇: new 朝仪万汇(this),
      寒更晓箭: new 寒更晓箭(this),
      宠物: new 宠物(this),
      引风唤灵: new 引风唤灵(this),
      金乌见坠: new 金乌见坠(this),
      弛律召野: new 弛律召野(this),
      触发橙武: new 触发橙武(this),
    }
  }

  添加buff({ 名称, 对象 = '目标', 事件时间 = this.当前时间, 新增层数 = 1, 覆盖层数 = 0 }) {
    const 当前层数 =
      对象 === '自身'
        ? this.当前自身buff列表[名称]?.当前层数
        : this.当前目标buff列表[名称]?.当前层数

    const 新buff对象 = {
      ...this.Buff和Dot数据[名称],
      当前层数: 覆盖层数
        ? 覆盖层数
        : Math.min((当前层数 || 0) + 新增层数, this.Buff和Dot数据[名称].最大层数 || 1),
      刷新时间: 事件时间,
    }
    if ((新buff对象.当前层数 !== 当前层数 && 新buff对象.当前层数 !== 1) || 名称 === '标鹄') {
      this.添加战斗日志({
        日志: `${名称}层数变为【${新buff对象.当前层数}】`,
        日志类型: 对象 === '自身' ? '自身buff变动' : '目标buff变动',
        日志时间: 事件时间,
      })
    } else {
      this.添加战斗日志({
        日志: `${对象}获得${名称}`,
        日志类型: 对象 === '自身' ? '自身buff变动' : '目标buff变动',
        日志时间: 事件时间,
      })
    }

    if (对象 === '自身') {
      this.当前自身buff列表[名称] = { ...新buff对象 }
    } else {
      this.当前目标buff列表[名称] = { ...新buff对象 }
    }
  }

  卸除buff({ 名称, buff刷新时间 = 0, 对象 = '目标', 事件时间 = this.当前时间, 卸除层数 = 1 }) {
    const 当前层数 =
      对象 === '自身'
        ? this.当前自身buff列表[名称]?.当前层数
        : this.当前目标buff列表[名称]?.当前层数

    if (当前层数 && 当前层数 >= 0) {
      if (当前层数 - 卸除层数 > 0) {
        this.添加战斗日志({
          日志: `${名称}层数变为【${当前层数 - 卸除层数}】`,
          日志类型: 对象 === '自身' ? '自身buff变动' : '目标buff变动',
          日志时间: 事件时间,
        })
        const 新buff对象 = {
          ...this.Buff和Dot数据[名称],
          当前层数: 当前层数 - 卸除层数,
          刷新时间: buff刷新时间 || 事件时间,
        }
        if (对象 === '自身') {
          this.当前自身buff列表[名称] = { ...新buff对象 }
        } else {
          this.当前目标buff列表[名称] = { ...新buff对象 }
        }
      } else {
        this.添加战斗日志({
          日志: `${对象}失去${名称}`,
          日志类型: 对象 === '自身' ? '自身buff变动' : '目标buff变动',
          日志时间: 事件时间,
        })
        if (对象 === '自身') {
          delete this.当前自身buff列表[名称]
        } else {
          delete this.当前目标buff列表[名称]
        }
      }
    }
  }

  // 校验奇穴是否存在
  校验奇穴是否存在(待判断奇穴) {
    return this?.奇穴?.includes(待判断奇穴)
  }

  // 箭数校验
  箭数校验(当前技能: CycleSimulatorSkillDTO | undefined, 校验箭数?) {
    const 箭数 = 校验箭数 ? 校验箭数 : 当前技能?.消耗箭数
    if (箭数) {
      if (this.角色状态信息.箭数 < 箭数) {
        return {
          可以释放: false,
          异常信息: ERROR_ACTION.箭数不足,
        }
      } else {
        return { 可以释放: true }
      }
    } else {
      return { 可以释放: true }
    }
  }

  // ----------------- 时间、GCD、CD相关算法 start----------------- //
  /**
   *
   * @param 增加时间方法
   * @description 每次增加时间方法都要同步推进GCD
   */
  增加时间(time) {
    if (time > 0) {
      this.跳过全部GCD时间(time)
      // 增加时间
      this.当前时间 = this.当前时间 + (time > 0 ? time : 0 || 0)
      this.DOT结算与更新()
    }
  }

  跳过全部GCD时间(time) {
    // 减少GCD剩余时间
    const 新GCD组: 技能GCD组 = { 公共: 0, 自身: 0 }
    Object.keys(this.GCD组).map((key) => {
      新GCD组[key] = Math.max((this.GCD组[key] || 0) - time, 0)
    })
    this.GCD组 = { ...新GCD组 }
  }

  技能释放前检查GCD统一方法(当前技能: CycleSimulatorSkillDTO) {
    let 校验GCD组: string = 当前技能.技能GCD组 as string
    if (当前技能.技能GCD组 === '自身') {
      校验GCD组 = 当前技能?.技能名称
    }
    if (校验GCD组) {
      // 大部分技能只检查自己的GCD
      const GCD = this.GCD组[校验GCD组]
      // 增加GCD
      return GCD || 0
    }
    return 0
  }

  // 对所有有CD技能检查和充能
  对所有有CD技能检查和充能() {
    Object.keys(this.技能类实例集合).forEach((key) => {
      const 实例 = this.技能类实例集合[key]
      const 当前技能 = this.技能基础数据?.find((item) => item.技能名称 === key)
      if (实例?.技能运行数据) {
        const 最大充能层数 = 当前技能?.最大充能层数 || 1
        const 当前层数 = 实例?.技能运行数据?.当前层数
        const 计划下次充能时间点 = 实例?.技能运行数据?.计划下次充能时间点 || 0
        if (当前层数 < 最大充能层数) {
          // 当前有层数，检查充能度过情况，更新层数和充能时间
          let 新层数 = 当前层数
          let 新充能时间点 = 计划下次充能时间点
          const 充能 = () => {
            if (新充能时间点 <= this.当前时间 && 新层数 < 最大充能层数) {
              新层数 = 新层数 + 1
              // 没充满，继续跑充能CD
              if (新层数 < 最大充能层数) {
                新充能时间点 = 新充能时间点 + (当前技能?.技能CD || 0)
              }
              if (新充能时间点 <= this.当前时间 && 新层数 < 最大充能层数) {
                充能()
              }
            }
          }
          if (新充能时间点 && 新充能时间点 <= this.当前时间) {
            充能()
            实例?.更新技能运行数据({ 当前层数: 新层数, 计划下次充能时间点: 新充能时间点 })
          }
        }
      }
    })
  }

  技能释放前检查运行数据(当前技能: CycleSimulatorSkillDTO, 技能实例: 检查运行数据实例类型, GCD) {
    let 等待CD时间 = 0
    const 可以释放时间 = this.当前时间 + GCD || 0
    if (技能实例?.技能运行数据) {
      const 当前层数 = 技能实例?.技能运行数据?.当前层数
      const 计划下次充能时间点 = 技能实例?.技能运行数据?.计划下次充能时间点 || 0
      // 当前层数为-1，说明未初始化实例，设置为最大层数
      if (当前层数 <= 0) {
        // 当前没有层数可用，需要等待充能
        // 增加GCD
        if (计划下次充能时间点 > 可以释放时间) {
          等待CD时间 = 计划下次充能时间点 - 可以释放时间
        }
        const 新层数 = Math.min(当前层数 + 1, 当前技能?.最大充能层数 || 1)
        技能实例?.更新技能运行数据({ 当前层数: 新层数 })
      }
    }
    return 等待CD时间
  }

  技能GCD和CD处理(
    等待CD,
    技能预估释放时间,
    当前技能: CycleSimulatorSkillDTO,
    技能实例: 检查运行数据实例类型
  ) {
    // 判断在处理完特殊事件以后，剩余的待定时间还有多少
    const 时间差 = 技能预估释放时间 - this.当前时间
    if (时间差 && 时间差 > 0) {
      console.log('等待CD', 等待CD)
      console.log('时间差', 时间差)
      this.增加时间(时间差)
      if (等待CD) {
        this.添加战斗日志({
          日志: `【${当前技能?.技能名称}】等技能CD【${等待CD}】帧`,
          日志类型: '等CD',
          日志时间: this.当前时间,
        })
        const 当前层数 = 技能实例?.技能运行数据?.当前层数
        const 新层数 = Math.min(当前层数 + 1, 当前技能?.最大充能层数 || 1)
        技能实例?.更新技能运行数据({ 当前层数: 新层数 })
      }
    }
  }

  技能释放后更新运行数据(当前技能: CycleSimulatorSkillDTO, 技能实例: 检查运行数据实例类型) {
    if (技能实例?.技能运行数据) {
      const 最大充能层数 = 当前技能?.最大充能层数 || 1
      const 是否为充满后第一次释放 = 技能实例?.技能运行数据?.当前层数 === 最大充能层数
      const 释放后层数 = 技能实例?.技能运行数据?.当前层数 - 1
      const 当前时间 = this.当前时间 || 0
      console.log('是否为充满后第一次释放', 是否为充满后第一次释放)
      console.log('技能实例?.技能运行数据?.当前层数', 技能实例?.技能运行数据?.当前层数)
      console.log('释放后层数', 释放后层数)
      console.log('当前时间', 当前时间)
      if (是否为充满后第一次释放) {
        技能实例?.更新技能运行数据({
          当前层数: 释放后层数,
          计划下次充能时间点: 当前时间 + (当前技能?.技能CD || 0),
        })
      } else {
        if (释放后层数 <= 0) {
          const 原充能时间 = 技能实例?.技能运行数据?.计划下次充能时间点 || 0
          const 计算充能时间 =
            原充能时间 <= 当前时间 ? 当前时间 + (当前技能?.技能CD || 0) : 原充能时间
          技能实例?.更新技能运行数据({
            当前层数: 释放后层数,
            计划下次充能时间点: 计算充能时间,
          })
        } else {
          技能实例?.更新技能运行数据({
            当前层数: 释放后层数,
          })
        }
      }
    }
  }

  // ----------------- 时间、GCD、CD相关算法 end----------------- //

  // 添加战斗日志
  添加战斗日志(log: CycleSimulatorLog) {
    const { 日志时间 = this.当前时间, ...rest } = log
    this.战斗日志 = [
      ...(this.战斗日志 || []),
      {
        日志时间: 日志时间,
        ...rest,
      },
    ]
  }

  // 造成伤害
  技能造成伤害(
    来源,
    伤害次数 = 1,
    额外增益列表: string[] = [],
    造成时间 = this.当前时间,
    隐藏日志 = false,
    宠物 = false
  ) {
    const 技能增益列表 = 技能原始数据?.find((item) => item.技能名称 === 来源)?.技能增益列表 || []
    const 有关的buff列表 =
      技能增益列表
        ?.filter((item) => {
          const 当前增益数据 = 转化buff和增益名称(item.增益名称, this.当前自身buff列表)
          if (当前增益数据) {
            if (造成时间) {
              const 增益消失时间 = (当前增益数据?.刷新时间 || 0) + (当前增益数据?.最大持续时间 || 0)
              return 造成时间 <= 增益消失时间 && !!当前增益数据
            } else {
              return !!当前增益数据?.当前层数
            }
          } else {
            return false
          }
        })
        // 把宠物判断的人身上的承契去掉，取用额外增益列表里的增益
        ?.filter((item) => {
          if (宠物) {
            return !item?.增益名称?.includes('承契')
          } else {
            return true
          }
        })
        ?.map((item) => item.增益名称) || []

    const 总增益列表 = 有关的buff列表.concat(额外增益列表)

    if (this.校验奇穴是否存在('诸怀') && 总增益列表?.some((item) => item?.includes('承契'))) {
      总增益列表.push('诸怀')
    }

    if (!隐藏日志) {
      this.添加战斗日志({
        日志: 来源,
        日志类型: '造成伤害',
        日志时间: 造成时间,
        buff列表: 总增益列表 || [],
        其他数据: {
          伤害次数: 伤害次数,
        },
      })
    }
  }

  检查GCD(当前技能: CycleSimulatorSkillDTO, 技能实例) {
    let GCD = 0
    if (技能实例?.检查GCD) {
      GCD = 技能实例?.检查GCD?.()
    } else {
      GCD = this.技能释放前检查GCD统一方法(当前技能)
    }
    return GCD
  }

  // 判断GCD，技能CD等
  技能释放前(当前技能: CycleSimulatorSkillDTO, 技能实例, i) {
    let GCD = 0
    let 等待CD = 0

    // 判断是否为当前箭袋第一个技能
    if (i >= 0) {
      // 判断上一个技能对于本技能是否有GCD限制
      if (当前技能?.技能GCD组) {
        GCD = this.检查GCD(当前技能, 技能实例)
      }
      // 判断技能CD，如果存在CD。增加等待时间
      if (当前技能?.技能CD) {
        等待CD = this.技能释放前检查运行数据(当前技能, 技能实例, GCD)
      }
    }
    const 延迟等待 = this.当前时间 && (GCD || 等待CD) ? this.网络延迟 : 0
    const 技能计划释放时间 = this.当前时间 + GCD + 延迟等待
    return {
      技能计划释放时间: 技能计划释放时间,
      技能预估释放时间: 技能计划释放时间 + 等待CD,
      // GCD,
      等待CD,
    }
  }

  // 增加技能GCD
  增加技能GCD(当前技能: CycleSimulatorSkillDTO) {
    // GCD处理
    if (当前技能?.技能GCD组) {
      let 待更新GCD组: string = 当前技能.技能GCD组 as string
      if (当前技能.技能GCD组 === '自身') {
        待更新GCD组 = 当前技能?.技能名称
      }
      if (待更新GCD组) {
        this.GCD组[待更新GCD组] =
          (this.GCD组[待更新GCD组] || 0) + 当前技能?.技能释放后添加GCD - this.加速等级
      }
    }
  }

  // 增加技能CD
  增加技能CD(当前技能: CycleSimulatorSkillDTO, 技能实例) {
    // 技能CD处理
    if (当前技能?.技能CD) {
      if (技能实例?.技能释放后更新运行数据) {
        技能实例.技能释放后更新运行数据?.()
      } else {
        this.技能释放后更新运行数据(当前技能, 技能实例)
      }
    }
  }

  技能成功开始释放(当前技能: CycleSimulatorSkillDTO, 技能实例) {
    this.增加技能GCD(当前技能)

    // 饮羽簇CW无CD
    if (!(当前技能.技能名称 === '饮羽簇' && this.当前自身buff列表?.['橙武']?.当前层数)) {
      this.增加技能CD(当前技能, 技能实例)
    }
  }

  // 判断添加GCD等
  技能释放后(
    当前技能: CycleSimulatorSkillDTO,
    计划释放时间: number,
    技能释放重要Buff列表,
    开始读条时间,
    技能预估释放时间,
    是否为读条技能
  ) {
    // 技能释放记录
    this.技能释放记录.push({
      技能名称: 当前技能?.技能名称,
      计划释放时间,
      实际释放时间: 技能预估释放时间,
      技能释放重要Buff列表,
      开始读条时间: 开始读条时间,
      是否为读条技能: 是否为读条技能,
    })
  }

  清空buff调用函数(对象: '自身' | '目标') {
    const buff列表 = 对象 === '自身' ? this.当前自身buff列表 : this.当前目标buff列表

    // 更新目标buff
    Object.keys(buff列表).forEach((key) => {
      const buff对象 = buff列表[key]
      const buff应该消失时间 = (buff对象?.刷新时间 || 0) + (buff对象?.最大持续时间 || 0)
      const 消失层数 = buff对象?.自然消失失去层数 || buff对象?.最大层数
      if (buff应该消失时间 <= this.当前时间) {
        this.卸除buff({ 名称: key, 对象, 事件时间: buff应该消失时间, 卸除层数: 消失层数 })
      }
    })
  }

  清空已经消失的buff() {
    // 更新目标buff
    this.清空buff调用函数('目标')
    // 更新自身buff
    this.清空buff调用函数('自身')
  }

  // 对当前的DOT进行已过期的结算和剩余时间更新
  DOT结算与更新() {
    this.技能类实例集合?.贯穿?.结算贯穿伤害()
  }

  // 普通攻击结算() {
  //   // 风矢从0秒开始，每1.5秒（24帧造成一次伤害）
  //   const 风矢间隔 = 基础GCD帧
  //   if (this.风矢上次造成伤害时间 !== undefined) {
  //     if (this.风矢上次造成伤害时间 + 风矢间隔 <= this.当前时间) {
  //       const 本次应该造成风矢伤害序列: number[] = [this.风矢上次造成伤害时间 + 风矢间隔]
  //       while (
  //         本次应该造成风矢伤害序列?.[本次应该造成风矢伤害序列.length - 1] + 风矢间隔 <=
  //         this.当前时间
  //       ) {
  //         本次应该造成风矢伤害序列.push(
  //           本次应该造成风矢伤害序列?.[本次应该造成风矢伤害序列.length - 1] + 风矢间隔
  //         )
  //       }
  //       for (let i = 0; i < 本次应该造成风矢伤害序列.length; i++) {
  //         this.技能造成伤害('风矢', undefined, undefined, 本次应该造成风矢伤害序列[i])
  //         if (i === 本次应该造成风矢伤害序列.length - 1) {
  //           this.风矢上次造成伤害时间 = 本次应该造成风矢伤害序列[i]
  //         }
  //       }
  //     }
  //   } else {
  //     this.技能造成伤害('风矢')
  //     this.风矢上次造成伤害时间 = 0
  //   }
  // }

  // 模拟轮次开始
  本轮模拟开始前() {
    // 增加网络延迟，0时不增加延迟
    this.重置循环执行结果()
    this.事件结算()
  }

  // 事件结算
  事件结算() {
    this.待生效事件结算()
    // this.清空已经消失的buff()
    this.DOT结算与更新()
    // this.普通攻击结算()
  }

  // 模拟轮次释放结束
  本轮模拟结束后() {
    // 判断buff列表，清空已经消失的buff
    this.清空已经消失的buff()
    this.对所有有CD技能检查和充能()
  }

  // 技能释放校验
  技能释放校验(技能实例, 当前技能) {
    const 体态校验结果 = this.箭数校验(当前技能)
    const 释放判断结果 = 技能实例.释放
      ? 技能实例.释放?.() || { 可以释放: true }
      : { 可以释放: true }
    const 校验结果 = {
      可以释放: 体态校验结果.可以释放 && 释放判断结果.可以释放,
      异常信息: 体态校验结果.异常信息 || 释放判断结果.异常信息,
    }
    if (校验结果.可以释放) {
      this.添加战斗日志?.({
        日志: 当前技能?.技能名称,
        日志类型: '释放技能',
      })
    }
    return 校验结果
  }

  // 技能释放异常
  技能释放异常(校验结果, 当前技能, i) {
    this.添加战斗日志({
      日志: `循环在第${i + 1}个技能${当前技能?.技能名称}异常终止`,
      日志类型: '循环异常',
    })
    this.循环执行结果 = '异常'
    if (校验结果?.异常信息) {
      this.循环异常信息 = {
        异常索引: i + 1,
        异常信息: 校验结果?.异常信息,
      }
    }
  }

  待生效事件结算(结算判断时间 = this.当前时间) {
    if (this.待生效事件队列.length) {
      // 轮训执行完成所有的事件
      const 轮训执行事件 = () => {
        if (this.待生效事件队列[0]?.事件时间 <= 结算判断时间) {
          // 先推进时间到事件时间
          const 当前事件 = this.待生效事件队列[0]
          this.DOT结算与更新()
          this.增加时间(当前事件.事件时间 - this.当前时间)
          // this.DOT结算与更新()
          // this.清空已经消失的buff()
          this.添加战斗日志?.({
            日志: `事件【${当前事件.事件名称}】触发`,
            日志类型: '技能释放结果',
            日志时间: this.当前时间,
          })
          if (当前事件.事件名称?.includes('没石饮羽')) {
            this.技能类实例集合.没石饮羽.没石饮羽触发(当前事件.事件备注)
          } else if (当前事件.事件名称?.includes('宠物攻击')) {
            this.技能类实例集合.宠物.宠物攻击(
              当前事件.事件备注.宠物名称,
              this.当前时间,
              当前事件.事件备注.额外buff
            )
          } else if (当前事件.事件名称?.includes('宠物离场')) {
            this.技能类实例集合.宠物.宠物离场(当前事件.事件备注.宠物名称, this.当前时间)
          } else if (当前事件.事件名称?.includes('技能读条')) {
            const 技能名称 = 当前事件?.事件备注?.技能名称
            if (技能名称 && this.技能类实例集合?.[技能名称]) {
              this.技能类实例集合?.[技能名称]?.读条伤害()
            }
          } else if (当前事件.事件名称?.includes('卸除buff')) {
            if (当前事件?.事件备注?.buff名称) {
              this.卸除buff({
                名称: 当前事件?.事件备注?.buff名称,
                对象: 当前事件?.事件备注?.buff对象,
                卸除层数: 当前事件?.事件备注?.卸除层数,
              })
            }
          }
          this.待生效事件队列?.shift()
          if (this.待生效事件队列.length) {
            轮训执行事件()
          }
        }
      }

      轮训执行事件()
      // this.待生效事件队列 = [...未生效事件]
    }
  }

  添加待生效事件队列(传入数据: 待生效事件[], 事件覆盖 = false) {
    let 新待生效事件队列: 待生效事件[] = []
    // 把原来事件中的同名事件修改时间
    if (事件覆盖) {
      if (this.待生效事件队列?.some((item) => item.事件名称 === 传入数据?.[0]?.事件名称)) {
        新待生效事件队列 = this.待生效事件队列.map((item) => {
          if (item.事件名称 === 传入数据?.[0]?.事件名称) {
            return 传入数据?.[0]
          } else {
            return item
          }
        })
      } else {
        新待生效事件队列 = (this.待生效事件队列 || []).concat(传入数据 || [])
      }
    } else {
      新待生效事件队列 = (this.待生效事件队列 || []).concat(传入数据 || [])
    }
    // 由于不确定待生效事件时间分布，重新排序
    新待生效事件队列.sort((a, b) => {
      return (a?.事件时间 || 0) - (b?.事件时间 || 0)
    })
    this.待生效事件队列 = [...新待生效事件队列]
  }

  删除待生效事件队列(事件名称) {
    const 新待生效事件队列: 待生效事件[] = [...(this.待生效事件队列 || [])].filter(
      (item) => item.事件名称 !== 事件名称
    )
    // 由于不确定待生效事件时间分布，重新排序
    新待生效事件队列.sort((a, b) => {
      return (a?.事件时间 || 0) - (b?.事件时间 || 0)
    })
    this.待生效事件队列 = [...新待生效事件队列]
  }

  // ----------------- 通用函数 end----------------- //

  // ----------------- 职业特殊函数 start----------------- //
  于狩引爆贯穿判定(来源) {
    this.技能类实例集合.贯穿.引爆贯穿逻辑(来源, '于狩')
  }

  棘矢引爆贯穿判定(来源) {
    if (this.校验奇穴是否存在('棘矢') && this.角色状态信息.箭数 === 1) {
      this.技能类实例集合.贯穿.引爆贯穿逻辑(来源, '棘矢')
    }
  }

  金乌箭判定() {
    if (['红箭', '紫箭']?.includes(this.角色状态信息.箭形态)) {
      this.技能类实例集合.贯穿.获得和刷新贯穿('金乌')
      this.技能造成伤害('破')
    }
  }

  标鹄判定() {
    const 当前标鹄层数 = this.当前目标buff列表?.['标鹄']?.当前层数
    // 引爆标鹄
    if (当前标鹄层数 === 4) {
      // 引爆上一层贯穿
      this.技能类实例集合.贯穿.获得和刷新贯穿('标鹄')
      // 红箭标鹄而外上一层贯穿，疑似bug
      // if (['红箭', '紫箭']?.includes(this.角色状态信息.箭形态)) {
      //   this.技能类实例集合.贯穿.获得和刷新贯穿('标鹄-金乌-疑似bug')
      // }
      // 桑柘标鹄引爆额外上一层贯穿
      if (this.校验奇穴是否存在('桑柘')) {
        this.技能类实例集合.贯穿.获得和刷新贯穿('标鹄-桑柘')
      }
      this.添加战斗日志({
        日志: `标鹄引爆`,
        日志类型: '技能释放结果',
        日志时间: this.当前时间,
      })
      this.技能造成伤害('标鹄')
      let 新标鹄层数 = 1
      // 贯侯 引爆使目标额外获得一层标鹄
      if (this.校验奇穴是否存在('贯侯')) {
        新标鹄层数 = 2
      }
      this.添加buff({ 名称: '标鹄', 覆盖层数: 新标鹄层数 })
    } else {
      this.添加buff({ 名称: '标鹄' })
    }
  }

  消耗箭(来源, 消耗箭 = 1) {
    const 新箭数 = Math.max(this.角色状态信息.箭数 - 消耗箭, 0)
    this.角色状态信息.箭数 = 新箭数
    this.添加战斗日志({
      日志: `${来源} 使【箭】变为 ${新箭数}`,
      日志类型: '消耗箭',
    })
  }

  召唤宠物(额外buff?) {
    const 本次事件召唤索引 = this.召唤宠物索引 + 1 > 5 ? 0 : this.召唤宠物索引 + 1
    const 本次召唤宠物 = this.宠物序列[本次事件召唤索引]
    if (本次召唤宠物 && 本次事件召唤索引 !== this.召唤宠物索引) {
      this.技能类实例集合.宠物.召唤宠物(本次召唤宠物, 额外buff)
      this.召唤宠物索引 = 本次事件召唤索引
    }
  }

  获得承契() {
    if (this.校验奇穴是否存在('襄尺')) {
      const buff承契数据 = this.当前自身buff列表?.['承契']
      if (buff承契数据) {
        const 应该消失时间 = (buff承契数据.刷新时间 || 0) + (buff承契数据.最大持续时间 || 0)
        const 剩余帧 = 应该消失时间 - this.当前时间 || 0
        if (buff承契数据?.当前层数 === 5 && 剩余帧 >= 每秒郭氏帧 * 8) {
          this.技能类实例集合.金乌见坠.金乌充能(每秒郭氏帧 * 3)
        }
      }
    }
    // this.技能类实例集合.金乌见坠.金乌充能(每秒郭氏帧 * 3)
    this.添加buff({ 名称: '承契', 对象: '自身' })
  }

  更新当前宠物数据(宠物, 数据) {
    this.当前宠物数据[宠物] = { ...数据 }
  }

  // ----------------- 职业特殊函数 end ----------------- //

  // 其他调用函数，供外层调用
  // 模拟函数，一个技能的释放生命周期
  模拟() {
    for (let i = 0; i < this.测试循环.length; i++) {
      this.本轮模拟开始前()
      const 当前技能 = this?.技能基础数据?.find((item) => item?.技能名称 === this.测试循环[i])
      if (当前技能) {
        const 技能实例 = this.技能类实例集合[当前技能?.技能名称]
        if (技能实例) {
          // 获取预估技能释放时间，处理预估时间前的所有待生效事件，推进时间轴
          const { 技能计划释放时间, 等待CD, 技能预估释放时间 } = this.技能释放前(
            当前技能,
            技能实例,
            i
          )
          // const 实际结算时间 = 结束读条时间 > 技能预估释放时间 ? 结束读条时间 : 技能预x估释放时间
          const 是否为读条技能 = !!技能实例?.读条时间?.()
          if (是否为读条技能) {
            技能实例?.读条?.(技能预估释放时间)
          }

          this.待生效事件结算(技能预估释放时间)
          this.技能GCD和CD处理(等待CD, 技能预估释放时间, 当前技能, 技能实例)

          const 开始读条时间 = 技能实例?.读条时间?.() ? 技能预估释放时间 : undefined
          const 结束读条时间 = 技能实例?.读条时间?.()
            ? 技能预估释放时间 + 技能实例?.读条时间?.()
            : 0
          this.技能成功开始释放(当前技能, 技能实例)
          const 释放校验结果 = this.技能释放校验(技能实例, 当前技能)
          const 是否为最后一个技能 = i === this.测试循环.length - 1
          const 开始释放时间 = this.当前时间
          // TODO
          const 技能释放重要Buff列表: string[] = []
          if (释放校验结果?.可以释放) {
            技能实例.命中?.(是否为最后一个技能)
            技能实例.造成伤害?.()
            // 推进到读条结束时间
            if (结束读条时间 && 结束读条时间 > this.当前时间) {
              this.待生效事件结算(结束读条时间)
              // this.增加时间(结束读条时间 - this.当前时间)
            }
            技能实例.释放后?.()
          } else {
            this.技能释放异常(释放校验结果, 当前技能, i)
            break
          }
          this.技能释放后(
            当前技能,
            技能计划释放时间,
            技能释放重要Buff列表,
            开始读条时间,
            开始释放时间,
            是否为读条技能
          )
        }
      }
      this.本轮模拟结束后()
    }
  }

  // 将日志按时间排序
  日志排序() {
    const 新日志 = [...(this.战斗日志 || [])]

    新日志.sort((a, b) => {
      return (a?.日志时间 || 0) - (b?.日志时间 || 0)
    })

    const 普通攻击处理日志 = this.普通攻击日志(新日志)

    普通攻击处理日志.sort((a, b) => {
      return (a?.日志时间 || 0) - (b?.日志时间 || 0)
    })

    this.战斗日志 = [...(普通攻击处理日志 || [])]
  }

  // 普通攻击日志
  普通攻击日志 = (战斗日志: CycleSimulatorLog[]) => {
    const 所有释放技能数组: any = 战斗日志.filter((item) => {
      return item?.日志类型 === '释放技能'
    })
    // 读条期间不释放普通攻击
    const 找出所有读条技能的区间: Array<{ 开始时间: number; 结束时间: number; 是否读条: boolean }> =
      所有释放技能数组
        .map((item, index) => {
          // const 当前技能 = this.技能基础数据?.find((a) => a?.技能名称 === item?.日志)
          const 是否读条 = item?.日志 && ['朝仪万汇']?.includes(item?.日志)
          return {
            开始时间: item?.日志时间,
            结束时间: 所有释放技能数组[index + 1]
              ? 所有释放技能数组[index + 1]?.日志时间
              : item?.日志时间,
            是否读条: 是否读条,
          }
        })
        .filter((item: any) => {
          return item?.是否读条
        })
    const 战斗最大时间 = this.当前时间
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
        buff列表: ['承契_5层'],
      })
    })

    return 战斗日志副本
  }

  获取当前各技能的运行状态() {
    const 各技能当前运行状态 = {}
    ;(Object.keys(this.技能类实例集合) || []).forEach((key) => {
      各技能当前运行状态[key] = this.技能类实例集合[key]?.技能运行数据 || {}
    })
    return 各技能当前运行状态
  }
}

export default 循环主类

export type 循环主类类型 = typeof 循环主类
