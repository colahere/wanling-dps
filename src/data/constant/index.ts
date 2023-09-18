/**
 * 常量文件
 */

import { NetworkDTO, TargetDTO } from '@/@types/character'

// 非侠系数
export const 非侠系数 = 1.0

export const 自身等级 = 120 // 当前角色等级
export const 每等级减伤 = 0.05
export const 每等级减伤系数 = 51

// 120级自身属性系数
// 数据源：https://www.jx3box.com/bps/45088

export const 属性系数 = {
  会心: 78622.5,
  会效: 27513.75,
  御劲: 78622.5,
  化劲: 11385.5, // *
  命中: 57180.75,
  闪避: 30549.75, // *
  招架: 35846.25, // *
  无双: 75809.25,
  外防: 42000.75, // *
  内防: 42000.75, // *
  破防: 78622.5,
  急速: 96483.75,
  御劲减会伤: 21095.25,
}

export const 加成系数 = {
  // 职业属性加成
  身法加成面板攻击: 1.45,
  // 0.58心法加成，0.64身法本身加成
  身法加成会心: 0.58 + 0.64,
}

export const 目标集合: TargetDTO[] = [
  {
    名称: '124级木桩',
    等级: 124,
    防御点数: 27550,
    防御系数: 51164.55,
    防御值: 0.35, // 35%
  },
  {
    名称: '123级木桩',
    等级: 123,
    防御点数: 26317,
    防御系数: 48873.6,
    防御值: 0.35, // 35%
  },
  {
    名称: '122级木桩',
    等级: 122,
    防御点数: 15528,
    防御系数: 46582.65,
    防御值: 0.25, // 25%
  },
  {
    名称: '121级木桩',
    等级: 121,
    防御点数: 11073,
    防御系数: 44291.7,
    防御值: 0.2, // 20%
  },
]

export const 精炼加成系数 = {
  1: 0.005,
  2: 0.013,
  3: 0.024,
  4: 0.038,
  5: 0.055,
  6: 0.075,
  7: 0.098,
  8: 0.124,
  9: 0.153,
  10: 0.185,
}

export const 延迟设定: NetworkDTO[] = [
  {
    label: '珠海万灵（30以下）',
    value: 1,
  },
  {
    label: '普通人（30-90）',
    value: 2,
  },
  {
    label: '我命由我不由天（90以上）',
    value: 3,
  },
]
