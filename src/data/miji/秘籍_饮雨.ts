import { GainDpsTypeEnum, GainTypeEnum } from '@/@types/enum'
import { MijiBasicDataDTO } from '@/@types/miji'

const Miji_Gufengpolang: MijiBasicDataDTO[] = [
  {
    秘籍名称: '3%伤害',
    常驻增益: true,
    增益集合: [
      {
        增益类型: GainTypeEnum.伤害百分比,
        增益计算类型: GainDpsTypeEnum.A,
        增益数值: 0.03,
      },
    ],
  },
  {
    秘籍名称: '2%伤害',
    常驻增益: true,
    增益集合: [
      {
        增益类型: GainTypeEnum.伤害百分比,
        增益计算类型: GainDpsTypeEnum.A,
        增益数值: 0.02,
      },
    ],
  },
  {
    秘籍名称: '4%会心',
    常驻增益: true,
    增益集合: [
      {
        增益类型: GainTypeEnum.外攻会心百分比,
        增益计算类型: GainDpsTypeEnum.A,
        增益数值: 0.04,
      },
    ],
  },
  {
    秘籍名称: '3%会心',
    常驻增益: true,
    增益集合: [
      {
        增益类型: GainTypeEnum.外攻会心百分比,
        增益计算类型: GainDpsTypeEnum.A,
        增益数值: 0.03,
      },
    ],
  },
]

export default Miji_Gufengpolang
