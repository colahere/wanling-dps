import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Form, Modal, Tooltip } from 'antd'

import { useAppDispatch, useAppSelector } from '@/hooks'
import { 更新角色最终属性, 更新方案数据 } from '@/store/basicReducer'
import { EquipmentCharacterPositionEnum } from '@/@types/enum'
import { 更新技能基础数据 } from '@/store/basicReducer'
import ValueCheckBox from '@/components/common/ValueCheckBox'
import { CharacterFinalDTO } from '@/@types/character'
import { currentDpsFunction } from '@/store/basicReducer/current-dps-function'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { 装备信息数据类型 } from '@/@types/equipment'

import { getFinalCharacterBasicDataByEquipment } from '../util'
import { getNewEquipmentData, 根据装备格式化技能基础数据 } from './utils'
import ZhuangbeiSelect from './ZhuangbeiSelect'
import WuCaiShiXuanZe from './WuCaiShiXuanZe'
import MohedaoruModal from './MohedaoruModal'
import CharacterActive from './CharacterActive'
import Zhuangbeizengyi from './Zhuangbeizengyi'
import MaxFumo from './MaxFumo'
import MaxWucaishi from './MaxWucaishi'
import { 根据秘籍奇穴装备格式化技能信息 } from '@/utils/skill-dps'
import './index.css'

function ZhuangbeiSet({ visible, onClose, getDpsFunction }) {
  const [form] = Form.useForm()

  const dispatch = useAppDispatch()
  const 角色最终属性 = useAppSelector((state) => state?.basic?.角色最终属性)
  const 装备信息 = useAppSelector((state) => state?.basic?.装备信息)
  const 当前计算结果DPS = useAppSelector((state) => state?.basic?.当前计算结果DPS)
  const 技能基础数据 = useAppSelector((state) => state?.basic?.技能基础数据)
  const 当前奇穴信息 = useAppSelector((state) => state?.basic?.当前奇穴信息)
  const 当前秘籍信息 = useAppSelector((state) => state?.basic?.当前秘籍信息)

  const [zhuangbeizengyi, setZhuangbeizengyi] = useState<any>()
  const [默认镶嵌宝石等级, 设置默认镶嵌宝石等级] = useState<number>(8)
  const [afterDps, setAfterDps] = useState<number>(0)
  const [当前装备下配置, 更新当前装备下配置] = useState<
    | {
        当前角色最终属性: CharacterFinalDTO
        当前角色装备信息: 装备信息数据类型
      }
    | undefined
  >()
  const [moHeDaoRuVisible, setMoHeDaoRuVisible] = useState(false)

  // 开启智能装备对比
  const [openEquipmentDiff, setOpenEquipmentDiff] = useState<boolean>(false)

  useEffect(() => {
    if (装备信息 && visible) {
      initEquipment(装备信息)
    }
    if (!visible) {
      setAfterDps(0)
      更新当前装备下配置(undefined)
      setZhuangbeizengyi(null)
    }
  }, [visible])

  const initEquipment = (data) => {
    const newObj = {
      五彩石: data.五彩石,
      大附魔_伤帽: data?.大附魔_伤帽,
      大附魔_伤衣: data?.大附魔_伤衣,
      大附魔_伤腰: data?.大附魔_伤腰,
      大附魔_伤腕: data?.大附魔_伤腕,
      大附魔_伤鞋: data?.大附魔_伤鞋,
    }
    Object.keys(EquipmentCharacterPositionEnum).map((item, index) => {
      const o = data.装备列表?.find(
        (a, i) => a.装备部位 === EquipmentCharacterPositionEnum[item] && index === i
      )
      if (o) {
        newObj[`${EquipmentCharacterPositionEnum[item]}${item}`] = o
      }
    })
    form.setFieldsValue(newObj)
    getDpsFunction()
    setZhuangbeizengyi({
      套装双会: data.套装会心会效,
      套装饮羽: data.套装技能,
      龙门武器: data.龙门武器,
      大CW: data.大橙武特效,
      小CW: data.小橙武特效,
      特效武器: data.水特效武器 || data.水特效武器_英雄,
      特效腰坠: data.风特效腰坠 || data.风特效腰坠_英雄,
      切糕会心: data.切糕会心 || data.切糕会心_英雄,
      切糕无双: data.切糕无双 || data.切糕无双_英雄,
      冬至套装: data?.冬至套装,
    })
    formValueChange(undefined, newObj)
  }

  const onOk = () => {
    form.validateFields().then((value) => {
      const data = getNewEquipmentData(value)
      dispatch(更新方案数据({ 数据: data, 属性: '装备信息' }))

      const { basicData, finalData } = getFinalCharacterBasicDataByEquipment(data)
      dispatch(更新方案数据({ 数据: basicData, 属性: '角色基础属性' }))
      const params: any = { ...data }
      if (params.装备列表) {
        delete params.装备列表
      }
      dispatch(
        更新角色最终属性({
          ...finalData,
          装备增益: {
            ...params,
          },
        })
      )
      const newSkillBasicData = 根据装备格式化技能基础数据(技能基础数据, data)
      dispatch(更新技能基础数据(newSkillBasicData))
      onClose(true)
    })
  }

  // 设置所有镶嵌为6/8级
  const setAllXiangQian = (number) => {
    form?.validateFields().then((values) => {
      const res = { ...values }
      Object.keys(values)
        .filter(
          (item) =>
            res[item] &&
            ![
              '五彩石',
              '大附魔_伤帽',
              '大附魔_伤衣',
              '大附魔_伤腰',
              '大附魔_伤腕',
              '大附魔_伤鞋',
            ].includes(item)
        )
        .map((item) => {
          return {
            ...values[item],
            key: item,
            镶嵌孔数组: values[item]?.镶嵌孔数组?.map((a) => {
              return {
                ...a,
                镶嵌宝石等级: number,
              }
            }),
          }
        })
        .forEach((item) => {
          if (res[item.key]) {
            const newObj = { ...item }
            delete newObj.key
            res[item.key] = { ...newObj }
          }
        })
      设置默认镶嵌宝石等级(number)
      form.setFieldsValue({
        ...res,
      })
      formValueChange(undefined, res)
    })
  }

  // 更换装备计算dps
  const formValueChange = (_, value) => {
    try {
      const data = getNewEquipmentData(value)

      const { finalData } = getFinalCharacterBasicDataByEquipment(data)

      const final: CharacterFinalDTO = {
        ...finalData,
        装备增益: { ...data },
      }

      更新当前装备下配置({
        当前角色最终属性: final,
        当前角色装备信息: data,
      })

      setZhuangbeizengyi({
        套装双会: data.套装会心会效,
        套装饮羽: data.套装技能,
        龙门武器: data.龙门武器,
        大CW: data.大橙武特效,
        小CW: data.小橙武特效,
        特效武器: data.水特效武器 || data.水特效武器_英雄,
        特效腰坠: data.风特效腰坠 || data.风特效腰坠_英雄,
        切糕会心: data.切糕会心 || data.切糕会心_英雄,
        切糕无双: data.切糕无双 || data.切糕无双_英雄,
        冬至套装: data?.冬至套装,
      })

      const 更新技能基础数据 = 根据秘籍奇穴装备格式化技能信息({
        技能基础数据: 技能基础数据,
        秘籍信息: 当前秘籍信息,
        奇穴数据: 当前奇穴信息,
        装备增益: data,
      })

      const { dpsPerSecond } = dispatch(
        currentDpsFunction({
          更新角色面板: final,
          更新技能基础数据: 更新技能基础数据,
        })
      )

      setAfterDps(dpsPerSecond)
    } catch (_) {
      更新当前装备下配置(undefined)
      setAfterDps(0)
    }
  }

  // 导入配装数据
  const daoru = (e) => {
    formValueChange(undefined, e)
    form.setFieldsValue({ ...e })
  }

  const 一键替换附魔 = (附魔信息) => {
    form?.validateFields().then((values) => {
      const obj = { ...values }
      Object.keys(附魔信息).forEach((fumoKey) => {
        const 附魔位置 = EquipmentCharacterPositionEnum[fumoKey]
        const formKey = `${附魔位置}${fumoKey}`

        const 附魔属性 = Object.keys(附魔信息[fumoKey])?.[0]
        const 附魔值 = Object.values(附魔信息[fumoKey])?.[0]
        if (values[formKey]) {
          obj[formKey] = {
            ...obj[formKey],
            附魔: `${附魔属性}+${附魔值}`,
          }
        }
      })
      form.setFieldsValue({ ...obj })
      formValueChange(undefined, { ...obj })
    })
  }

  const 一键替换五彩石 = (五彩石信息) => {
    form?.validateFields().then((values) => {
      const obj = { ...values, 五彩石: 五彩石信息 }
      form.setFieldsValue(obj)
      formValueChange(undefined, { ...obj })
    })
  }

  return (
    <Modal
      title={
        <div className='zhuangbei-input-set-modal-title'>
          <span>配装器</span>
          <div className='zhuangbei-input-set-modal-title-operate'>
            {/* 最佳附魔设置 */}
            <MaxFumo
              一键替换附魔={一键替换附魔}
              对比Dps={afterDps || 当前计算结果DPS}
              对比装备信息={当前装备下配置?.当前角色装备信息 || 装备信息}
            />
            {/* 最佳五彩石设置 */}
            <MaxWucaishi
              一键替换五彩石={一键替换五彩石}
              对比Dps={afterDps || 当前计算结果DPS}
              对比装备信息={当前装备下配置?.当前角色装备信息 || 装备信息}
            />
          </div>
        </div>
      }
      className={'zhuangbei-input-set-modal'}
      open={visible}
      width={1224}
      destroyOnClose
      footer={
        <div>
          <Button onClick={() => setMoHeDaoRuVisible(true)}>外部配装导入</Button>
          <Button type='primary' onClick={() => onOk()}>
            保存并计算
          </Button>
        </div>
      }
      centered
      onCancel={() => onClose()}
    >
      <div className='zhuangbei-form-header'>
        <div className='zhuangbei-form-left-1'>
          <h1 className='zhuangbei-form-title'>装备</h1>
          <Checkbox
            checked={openEquipmentDiff}
            onChange={(e) => setOpenEquipmentDiff(e?.target?.checked)}
            className={'zhuangbei-diff-btn'}
          >
            智能对比
            <Tooltip title='对比默认精炼等级下切换至另一件装备dps波动。考虑性能当前仅放出12800+品装备及精简。如使用卡顿请及时反馈'>
              <QuestionCircleOutlined className={'zhuangbei-diff-tip'} />
            </Tooltip>
          </Checkbox>
        </div>
        <div className='zhuangbei-form-left-2'>
          <h1 className='zhuangbei-form-title'>精炼</h1>
        </div>
        <div className='zhuangbei-form-left-3'>
          <h1 className='zhuangbei-form-title'>镶嵌孔</h1>
          <div>
            <Button
              size='small'
              onClick={() => setAllXiangQian(6)}
              className={'zhuangbei-form-set-btn'}
            >
              全六级
            </Button>
            <Button
              size='small'
              onClick={() => setAllXiangQian(7)}
              className={'zhuangbei-form-set-btn'}
            >
              全七级
            </Button>
            <Button
              size='small'
              onClick={() => setAllXiangQian(8)}
              className={'zhuangbei-form-set-btn'}
            >
              全八级
            </Button>
          </div>
        </div>
        <div className='zhuangbei-form-left-4'>
          <h1 className='zhuangbei-form-title'>附魔</h1>
        </div>
        <div className='zhuangbei-form-left-5'>
          <h1 className='zhuangbei-form-title'>大附魔</h1>
        </div>
        <div className='zhuangbei-form-left-6'>
          <h1 className='zhuangbei-form-title'>五彩石</h1>
        </div>
      </div>
      <Form
        colon={false}
        onValuesChange={formValueChange}
        className='zhuangbei-input-set-modal-form'
        form={form}
      >
        <div className='zhuangbei-input-set-modal-form-left'>
          {Object.keys(EquipmentCharacterPositionEnum).map((item) => {
            const data = EquipmentCharacterPositionEnum[item]
            return (
              <Form.Item label={data} name={`${data}${item}`} key={`${data}${item}`}>
                <ZhuangbeiSelect
                  form={form}
                  默认镶嵌宝石等级={默认镶嵌宝石等级}
                  type={data}
                  indexKey={item}
                  openEquipmentDiff={openEquipmentDiff}
                />
              </Form.Item>
            )
          })}
        </div>
        <div className='zhuangbei-set-dafumo-wrapper'>
          <Form.Item name={`大附魔_伤帽`}>
            <ValueCheckBox>伤帽</ValueCheckBox>
          </Form.Item>
          <Form.Item name={`大附魔_伤衣`}>
            <ValueCheckBox>伤衣</ValueCheckBox>
          </Form.Item>
          <Form.Item name={`大附魔_伤腰`}>
            <ValueCheckBox>伤腰</ValueCheckBox>
          </Form.Item>
          <Form.Item name={`大附魔_伤腕`}>
            <ValueCheckBox>伤腕</ValueCheckBox>
          </Form.Item>
          <Form.Item name={`大附魔_伤鞋`}>
            <ValueCheckBox>伤鞋</ValueCheckBox>
          </Form.Item>
        </div>
        <div className='zhuangbei-input-set-modal-form-right'>
          <Form.Item name={`五彩石`}>
            <WuCaiShiXuanZe />
          </Form.Item>
          {/* 当前面板展示 */}
          <CharacterActive
            当前角色最终属性={当前装备下配置?.当前角色最终属性 || 角色最终属性}
            当前角色装备信息={当前装备下配置?.当前角色装备信息 || 装备信息}
          />
          {/* 装备增益展示 */}
          <Zhuangbeizengyi zhuangbeizengyi={zhuangbeizengyi} />
          {当前计算结果DPS !== afterDps && afterDps ? (
            <div className={'dps-diff'}>
              <div className='dps-diff-item'>
                <div className='dps-diff-title'>更换前</div>
                <p className='dps-diff-dps'>{当前计算结果DPS}</p>
              </div>
              <div className='dps-diff-item'>
                <div className='dps-diff-title'>替换后</div>
                <p
                  className={`dps-diff-dps ${
                    afterDps > 当前计算结果DPS ? 'dps-diff-up' : 'dps-diff-down'
                  }`}
                >
                  {afterDps}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </Form>
      <MohedaoruModal
        visible={moHeDaoRuVisible}
        onClose={() => setMoHeDaoRuVisible(false)}
        onOk={(e) => daoru(e)}
      />
    </Modal>
  )
}

export default ZhuangbeiSet
