import { EquipmentInlayEnum, EquipmentTypeEnum, GainTypeEnum } from '@/@types/enum'
import { EquipmentDTO } from './../../../@types/equipment'

const ZHUANGBEI_XIANGLIAN: EquipmentDTO[] = [
  {
    id: 37800,
    uid: '208314',
    装备名称: '无封项链',
    装备品级: 12100,
    装备类型: EquipmentTypeEnum.试炼精简,
    装备增益: [
      { 增益数值: 1792, 增益类型: GainTypeEnum.基础攻击 },
      { 增益数值: 4181, 增益类型: GainTypeEnum.外攻会心等级 },
    ],
    镶嵌孔数组: [{ 镶嵌类型: EquipmentInlayEnum.会效 }],
  },
  {
    id: 37801,
    uid: '208315',
    装备名称: '无封项链',
    装备品级: 12100,
    装备类型: EquipmentTypeEnum.试炼精简,
    装备增益: [
      { 增益数值: 1529, 增益类型: GainTypeEnum.基础攻击 },
      { 增益数值: 2414, 增益类型: GainTypeEnum.破招 },
      { 增益数值: 2414, 增益类型: GainTypeEnum.无双等级 },
    ],
    镶嵌孔数组: [{ 镶嵌类型: EquipmentInlayEnum.会心 }],
  },
  {
    id: 37802,
    uid: '208316',
    装备名称: '无封项链',
    装备品级: 12100,
    装备类型: EquipmentTypeEnum.试炼精简,
    装备增益: [
      { 增益数值: 1529, 增益类型: GainTypeEnum.基础攻击 },
      { 增益数值: 1295, 增益类型: GainTypeEnum.破招 },
      { 增益数值: 2237, 增益类型: GainTypeEnum.外攻会心等级 },
      { 增益数值: 1178, 增益类型: GainTypeEnum.外攻会心效果等级 },
    ],
    镶嵌孔数组: [{ 镶嵌类型: EquipmentInlayEnum.破防 }],
  },
  {
    id: 37684,
    uid: '207920',
    装备名称: '商野链',
    装备品级: 12450,
    装备类型: EquipmentTypeEnum.普通,
    装备增益: [
      { 增益数值: 2242, 增益类型: GainTypeEnum.体质 },
      { 增益数值: 435, 增益类型: GainTypeEnum.身法 },
      { 增益数值: 705, 增益类型: GainTypeEnum.基础攻击 },
      { 增益数值: 2181, 增益类型: GainTypeEnum.外攻破防等级 },
      { 增益数值: 1939, 增益类型: GainTypeEnum.无双等级 },
    ],
    镶嵌孔数组: [{ 镶嵌类型: EquipmentInlayEnum.无双 }],
  },
  {
    id: 37702,
    uid: '207980',
    装备名称: '染辞链',
    装备品级: 12450,
    装备类型: EquipmentTypeEnum.普通,
    装备增益: [
      { 增益数值: 2242, 增益类型: GainTypeEnum.体质 },
      { 增益数值: 435, 增益类型: GainTypeEnum.身法 },
      { 增益数值: 705, 增益类型: GainTypeEnum.基础攻击 },
      { 增益数值: 2181, 增益类型: GainTypeEnum.外攻会心等级 },
      { 增益数值: 1939, 增益类型: GainTypeEnum.无双等级 },
    ],
    镶嵌孔数组: [{ 镶嵌类型: EquipmentInlayEnum.破防 }],
  },
  {
    id: 37812,
    uid: '208368',
    装备名称: '湖月链',
    装备品级: 12450,
    装备类型: EquipmentTypeEnum.普通,
    装备增益: [
      { 增益数值: 2242, 增益类型: GainTypeEnum.体质 },
      { 增益数值: 435, 增益类型: GainTypeEnum.身法 },
      { 增益数值: 705, 增益类型: GainTypeEnum.基础攻击 },
      { 增益数值: 2181, 增益类型: GainTypeEnum.外攻会心等级 },
      { 增益数值: 1939, 增益类型: GainTypeEnum.破招 },
    ],
    镶嵌孔数组: [{ 镶嵌类型: EquipmentInlayEnum.破防 }],
  },
  {
    id: 37770,
    uid: '208146',
    装备名称: '欺林链',
    装备品级: 12600,
    装备类型: EquipmentTypeEnum.普通,
    装备增益: [
      { 增益数值: 2269, 增益类型: GainTypeEnum.体质 },
      { 增益数值: 440, 增益类型: GainTypeEnum.身法 },
      { 增益数值: 714, 增益类型: GainTypeEnum.基础攻击 },
      { 增益数值: 2207, 增益类型: GainTypeEnum.外攻破防等级 },
      { 增益数值: 1962, 增益类型: GainTypeEnum.破招 },
    ],
    镶嵌孔数组: [{ 镶嵌类型: EquipmentInlayEnum.攻击 }],
  },
]

export default ZHUANGBEI_XIANGLIAN
