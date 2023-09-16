import commonGainDTO from '@/data/skillGain/common'
import { SkillBasicDTO } from '@/@types/skill'
import { GainDpsTypeEnum, GainTypeEnum } from '@/@types/enum'
import 贯穿ainDTO from './skillGain/贯穿'

// const 贯穿伤害系数 = 0.15495 // 0.2
const 贯穿伤害系数 = 0.3359375
const 贯穿基础伤害 = 29

const WanlingSkillDataDTO: SkillBasicDTO[] = [
  {
    技能名称: '劲风簇',
    技能伤害系数: 1.34375,
    技能基础伤害_最小值: 37,
    技能基础伤害_最大值: 42,
    武器伤害系数: 0,
    伤害计算次数: 1,
    技能增益列表: commonGainDTO,
  },
  {
    技能名称: '饮雨簇',
    技能伤害系数: 3.2, // 3
    技能基础伤害_最小值: 70,
    技能基础伤害_最大值: 90,
    武器伤害系数: 0,
    伤害计算次数: 1,
    技能增益列表: commonGainDTO,
  },
  {
    技能名称: '霖急簇',
    技能伤害系数: 1,
    技能基础伤害_最小值: 28,
    技能基础伤害_最大值: 33,
    武器伤害系数: 1,
    伤害计算次数: 1,
    技能增益列表: commonGainDTO,
  },
  {
    技能名称: '白羽流星',
    技能伤害系数: 0.5,
    技能基础伤害_最小值: 35,
    技能基础伤害_最大值: 40,
    武器伤害系数: 1, // !描述0 实测1
    伤害计算次数: 1,
    技能增益列表: commonGainDTO,
  },
  {
    技能名称: '风矢',
    技能伤害系数: 0.25,
    技能基础伤害_最小值: 0,
    技能基础伤害_最大值: 0,
    武器伤害系数: 1,
    伤害计算次数: 1,
    技能增益列表: commonGainDTO,
  },
  {
    技能名称: '贯侯',
    技能伤害系数: 0.21215,
    技能基础伤害_最小值: 0,
    技能基础伤害_最大值: 0,
    武器伤害系数: 0,
    伤害计算次数: 1,
    技能增益列表: commonGainDTO,
  },
  {
    技能名称: '攻击-狼',
    技能伤害系数: 1.725, // 攻击三次
    技能基础伤害_最小值: 90,
    技能基础伤害_最大值: 110,
    武器伤害系数: 0,
    伤害计算次数: 1,
    技能增益列表: commonGainDTO,
  },
  {
    技能名称: '攻击-虎',
    技能伤害系数: 5.175,
    技能基础伤害_最小值: 270,
    技能基础伤害_最大值: 330,
    武器伤害系数: 0,
    伤害计算次数: 1,
    技能增益列表: commonGainDTO,
  },
  {
    技能名称: '攻击-鹰',
    技能伤害系数: 3.79375,
    技能基础伤害_最小值: 200,
    技能基础伤害_最大值: 240,
    武器伤害系数: 0,
    伤害计算次数: 1,
    技能增益列表: commonGainDTO,
  },
  {
    技能名称: '攻击-熊',
    技能伤害系数: 1.03125,
    技能基础伤害_最小值: 50,
    技能基础伤害_最大值: 70,
    武器伤害系数: 0,
    伤害计算次数: 1,
    技能增益列表: commonGainDTO,
  },
  {
    技能名称: '攻击-野猪',
    技能伤害系数: 1.725,
    技能基础伤害_最小值: 90,
    技能基础伤害_最大值: 110,
    武器伤害系数: 0,
    伤害计算次数: 1,
    技能增益列表: commonGainDTO,
  },
  {
    技能名称: '践踏', // 大象
    技能伤害系数: 3.79375,
    技能基础伤害_最小值: 200,
    技能基础伤害_最大值: 240,
    武器伤害系数: 0,
    伤害计算次数: 1,
    技能增益列表: commonGainDTO,
  },
  {
    技能名称: '贯穿(DOT)·一',
    技能伤害系数: 贯穿伤害系数,
    技能基础伤害_最小值: 贯穿基础伤害,
    技能基础伤害_最大值: 贯穿基础伤害,
    武器伤害系数: 0,
    伤害计算次数: 1,
    技能增益列表: 贯穿ainDTO,
  },
  {
    技能名称: '贯穿(DOT)·二',
    技能伤害系数: 贯穿伤害系数,
    技能基础伤害_最小值: 贯穿基础伤害,
    技能基础伤害_最大值: 贯穿基础伤害,
    武器伤害系数: 0,
    伤害计算次数: 2,
    技能增益列表: 贯穿ainDTO,
  },
  {
    技能名称: '贯穿(DOT)·三',
    技能伤害系数: 贯穿伤害系数,
    技能基础伤害_最小值: 贯穿基础伤害,
    技能基础伤害_最大值: 贯穿基础伤害,
    武器伤害系数: 0,
    伤害计算次数: 3,
    技能增益列表: 贯穿ainDTO,
  },
  {
    技能名称: '贯穿(DOT)·四',
    技能伤害系数: 贯穿伤害系数,
    技能基础伤害_最小值: 贯穿基础伤害,
    技能基础伤害_最大值: 贯穿基础伤害,
    武器伤害系数: 0,
    伤害计算次数: 4,
    技能增益列表: 贯穿ainDTO,
  },
  {
    技能名称: '贯穿(DOT)·五',
    技能伤害系数: 贯穿伤害系数,
    技能基础伤害_最小值: 贯穿基础伤害,
    技能基础伤害_最大值: 贯穿基础伤害,
    武器伤害系数: 0,
    伤害计算次数: 5,
    技能增益列表: 贯穿ainDTO,
  },
  {
    技能名称: '贯穿(DOT)·六',
    技能伤害系数: 贯穿伤害系数,
    技能基础伤害_最小值: 贯穿基础伤害,
    技能基础伤害_最大值: 贯穿基础伤害,
    武器伤害系数: 0,
    伤害计算次数: 6,
    技能增益列表: 贯穿ainDTO,
  },
  {
    技能名称: '贯穿(DOT)·六·引爆',
    技能伤害系数: 贯穿伤害系数,
    技能基础伤害_最小值: 贯穿基础伤害,
    技能基础伤害_最大值: 贯穿基础伤害,
    武器伤害系数: 0,
    伤害计算次数: 6 * 3,
    技能增益列表: 贯穿ainDTO,
  },
  {
    技能名称: '贯侯',
    技能伤害系数: 0.625,
    技能基础伤害_最小值: 30,
    技能基础伤害_最大值: 50,
    武器伤害系数: 0,
    伤害计算次数: 1,
    技能增益列表: commonGainDTO,
  },
  {
    技能名称: '白虹贯日',
    技能伤害系数: 7.25,
    技能基础伤害_最小值: 400,
    技能基础伤害_最大值: 600,
    武器伤害系数: 0,
    伤害计算次数: 1,
    技能增益列表: commonGainDTO,
  },
  {
    技能名称: '破',
    // 技能伤害系数: 13.1925 * 0.48 * 1.05, // 修改过一次 原来没有1.05
    技能伤害系数: 13.1925 * 0.15, // 修改过一次 原来没有1.05
    技能基础伤害_最小值: 0,
    技能基础伤害_最大值: 0,
    武器伤害系数: 0,
    伤害计算次数: 1,
    技能增益列表: commonGainDTO,
  },
  {
    技能名称: '逐云寒蕊',
    技能伤害系数: 1.274,
    技能基础伤害_最小值: 0,
    技能基础伤害_最大值: 0,
    武器伤害系数: 0,
    伤害计算次数: 1,
    技能增益列表: [
      ...commonGainDTO,
      {
        增益名称: '飘黄',
        增益所在位置: '套装',
        常驻增益: true,
        增益集合: [
          {
            增益类型: GainTypeEnum.郭氏无视防御,
            增益计算类型: GainDpsTypeEnum.B,
            增益数值: 1024,
          },
        ],
      },
    ],
  },
  {
    // 伤腕
    技能名称: '昆吾·弦刃',
    技能伤害系数: 0.57,
    技能基础伤害_最小值: 0,
    技能基础伤害_最大值: 0,
    武器伤害系数: 0,
    伤害计算次数: 1,
    技能增益列表: commonGainDTO,
  },
  {
    // 伤鞋
    技能名称: '刃凌',
    技能伤害系数: 0.57,
    技能基础伤害_最小值: 0,
    技能基础伤害_最大值: 0,
    武器伤害系数: 0,
    伤害计算次数: 1,
    技能增益列表: commonGainDTO,
  },
  {
    // 龙门武器
    技能名称: '剑风',
    技能伤害系数: 0,
    技能基础伤害_最小值: 3040,
    技能基础伤害_最大值: 3040,
    武器伤害系数: 0,
    伤害计算次数: 1,
    技能增益列表: commonGainDTO,
  },
]
export default WanlingSkillDataDTO
