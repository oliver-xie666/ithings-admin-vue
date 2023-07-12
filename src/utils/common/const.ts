export const DEVICE_TYPE_VALUE = [
  {
    label: '设备',
    value: 1,
  },
  {
    label: '网关',
    value: 2,
  },
  {
    label: '子设备',
    value: 3,
  },
]

export const AUTH_MODE_FORM = [
  { label: '账密认证', value: 1 },
  { label: '秘钥认证', value: 2 },
]

export const DATA_PROTO_FORM = [
  { label: '自定义', value: 1 },
  { label: '数据模板', value: 2 },
]

export const NET_TYPE_FORM = [
  { label: '其他', value: 1 },
  { label: 'wi-fi', value: 2 },
  { label: '2G/3G/4G', value: 3 },
  { label: '5G', value: 4 },
  { label: 'BLE', value: 5 },
  { label: 'LoRaWAN', value: 6 },
]

export const AUTO_REGISTER_FORM = [
  { label: '关闭', value: 1 },
  { label: '打开', value: 2 },
  { label: '打开并自动创建设备', value: 3 },
]
