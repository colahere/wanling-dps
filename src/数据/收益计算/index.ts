import {
  CommonEnchantNum,
  附魔名称枚举,
  增益计算类型枚举,
  增益类型枚举,
  小吃类型枚举,
} from '@/@types/enum'
import { SKillGainData } from '@/@types/skill'
import XIANGQIAN_DATA from '../镶嵌孔'
import XIAOCHI_DATA from '../小药小吃'

export interface IncomeDataDTO {
  收益计算名称: string
  /**
   * @name 增益集合
   */
  增益集合?: SKillGainData[]
}

// 用于收益计算的附魔
export const IncomeFumo: IncomeDataDTO[] = [
  {
    收益计算名称: 附魔名称枚举.攻击439,
    增益集合: [
      {
        增益计算类型: 增益计算类型枚举.A,
        增益类型: 增益类型枚举.基础攻击,
        增益数值: 439,
      },
    ],
  },
  {
    收益计算名称: 附魔名称枚举.身法218,
    增益集合: [
      {
        增益计算类型: 增益计算类型枚举.A,
        增益类型: 增益类型枚举.身法,
        增益数值: 218,
      },
    ],
  },
  {
    收益计算名称: 附魔名称枚举.破防974,
    增益集合: [
      {
        增益计算类型: 增益计算类型枚举.A,
        增益类型: 增益类型枚举.外攻破防等级,
        增益数值: +CommonEnchantNum.赛季974,
      },
    ],
  },
  {
    收益计算名称: 附魔名称枚举.无双974,
    增益集合: [
      {
        增益计算类型: 增益计算类型枚举.A,
        增益类型: 增益类型枚举.无双等级,
        增益数值: +CommonEnchantNum.赛季974,
      },
    ],
  },
  {
    收益计算名称: 附魔名称枚举.会心974,
    增益集合: [
      {
        增益计算类型: 增益计算类型枚举.A,
        增益类型: 增益类型枚举.外攻会心等级,
        增益数值: +CommonEnchantNum.赛季974,
      },
    ],
  },
  {
    收益计算名称: 附魔名称枚举.会效974,
    增益集合: [
      {
        增益计算类型: 增益计算类型枚举.A,
        增益类型: 增益类型枚举.外攻会心效果等级,
        增益数值: +CommonEnchantNum.赛季974,
      },
    ],
  },
  {
    收益计算名称: 附魔名称枚举.破招974,
    增益集合: [
      {
        增益计算类型: 增益计算类型枚举.A,
        增益类型: 增益类型枚举.破招,
        增益数值: +CommonEnchantNum.赛季974,
      },
    ],
  },
  {
    收益计算名称: 附魔名称枚举.武伤658,
    增益集合: [
      {
        增益计算类型: 增益计算类型枚举.A,
        增益类型: 增益类型枚举.近战武器伤害,
        增益数值: 658,
      },
    ],
  },
]

// 用于收益计算的小药
export const IncomeXiaoyao: IncomeDataDTO[] = XIAOCHI_DATA.filter(
  (item) => item.小吃部位 === 小吃类型枚举.药品增强
)
  .map((item) => {
    const name = item?.小吃名称?.split('（')?.[1].split('）')?.[0]
    return {
      收益计算名称: `${name}`,
      增益集合: item?.增益集合,
    }
  })
  .filter((item) => !item.收益计算名称.includes('加速'))

// 用于收益计算的小吃
export const IncomeXiaochi: IncomeDataDTO[] = XIAOCHI_DATA.filter(
  (item) => item.小吃部位 === 小吃类型枚举.食品增强
)
  .map((item) => {
    const name = item?.小吃名称?.split('（')?.[1]?.split('）')?.[0]
    return {
      收益计算名称: `${name}`,
      增益集合: item?.增益集合,
    }
  })
  .filter((item) => !item.收益计算名称.includes('加速'))

// 用于收益计算的五行石
export const IncomeWuxingshi: IncomeDataDTO[] = XIANGQIAN_DATA.map((item) => {
  const 增益 = item?.各等级增益数据?.[8]
  const name = item?.镶嵌类型
  return {
    收益计算名称: `${name}`,
    增益集合: [
      {
        增益计算类型: 增益计算类型枚举.A,
        增益类型: item.镶嵌增益类型,
        增益数值: 增益?.增益数值,
      },
    ],
  }
}).filter((item) => !item.收益计算名称.includes('加速'))
