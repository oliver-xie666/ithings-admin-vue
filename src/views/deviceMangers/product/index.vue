<script lang="ts" setup>
import { h, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { DataTableColumns, FormInst, FormRules } from 'naive-ui'
import { QuestionCircleOutlined } from '@vicons/antd'
import { useRequest } from 'vue-request'
import type { BasicTableProps } from '@/components/custom/Table'
import { BasicTable, TableAction } from '@/components/custom/Table'
import type { FormSchema } from '@/components/custom/Form/index'
import { BasicForm, useForm } from '@/components/custom/Form/index'
import { postApiV1ThingsProductInfoCreate, postApiV1ThingsProductInfoIndex, postApiV1ThingsProductInfo__openAPI__delete } from '~/src/api/chanpinguanli'
import { AUTH_MODE_FORM, AUTO_REGISTER_FORM, DATA_PROTO_FORM, DEVICE_TYPE_VALUE, NET_TYPE_FORM, timestampToDateStr } from '~/src/utils'
import { ResponseCode } from '~/src/enums'

export interface ProductListType {
  productID?: string
  productName?: string
  /** 产品图片 */
  productImg?: string
  /** 是否更新产品图片 只有这个参数为true的时候才会更新产品图片,传参为产品图片的file path */
  isUpdateProductImg?: boolean
  /* 产品秘钥 动态更新开启时有效 */
  secret?: string
  netType?: number
  dataProto?: number
  deviceType?: number
  authMode?: number
  autoRegister?: number
  categoryID?: number
  desc?: string
  createdTime?: string
  devStatus?: number
  tags?: { key?: string; value?: string }[]
}

const router = useRouter()
const formRef = ref<FormInst | null>(null)
const actionRef = ref()

const showModal = ref(false)
const formBtnLoading = ref(false)
const queryFormParams = reactive({
  productName: '',
  deviceType: 0,
})

const modalFormParams = reactive({
  productName: '',
  inputProductID: '',
  productID: '',
  deviceType: DEVICE_TYPE_VALUE?.[0]?.value,
  dataProto: DATA_PROTO_FORM?.[0]?.value,
  authMode: AUTH_MODE_FORM?.[0]?.value,
  netType: NET_TYPE_FORM?.[0]?.value,
  autoRegister: AUTO_REGISTER_FORM?.[0]?.value,
  description: '',
})

const rules: FormRules = {
  productName: [{
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入产品名称',
  }],
  productID: [{
    required: true,
    trigger: ['blur', 'input'],
    validator(_, value: string) {
      if (!value)
        return new Error('必填项！')
      else if (value.trim().length < 11)
        return new Error('不能少于11个字符！')
      else if (value.trim().length > 11)
        return new Error('不能超过11个字符')
      else if (!/^[a-zA-Z0-9]+$/.test(value))
        return new Error('只能有数字和字母')
      return true
    },
  }],
}

const columns: DataTableColumns<ProductListType> = [
  {
    key: 'productName',
    title: '产品名称',
  },
  {
    key: 'productID',
    title: '产品id',
  },
  {
    key: 'deviceType',
    title: '设备类型',
  },

  {
    key: 'createdTime',
    title: '创建时间',
    render: row => timestampToDateStr(Number(row?.createdTime)),
  },
]

const schemas: FormSchema[] = [
  {
    field: 'productName',
    component: 'NInput',
    label: '产品名称',
    componentProps: {
      placeholder: '请输入产品名称',
      onInput: (e: string) => {
        queryFormParams.productName = e
      },
    },
  },
  {
    field: 'deviceType',
    component: 'NSelect',
    label: '设备类型',
    componentProps: {
      placeholder: '请选择设备类型',
      options: DEVICE_TYPE_VALUE,
      onUpdateValue: (e: any) => {
        queryFormParams.deviceType = e
      },
    },
  },

]

const reloadTable = () =>
  actionRef.value.reload()

// 添加产品
const { run: addProductRun } = useRequest(postApiV1ThingsProductInfoCreate, {
  manual: true,
  onSuccess: (response) => {
    if (response.code === ResponseCode.SUCCESS)
      window.$message.success('新增产品成功')
    else window.$message.error('新增产品失败')
    showModal.value = false
    reloadTable()
  },
  onError: () => window.$message.error('新增产品错误'),
})

// 删除产品
const { run: deleteProductRun } = useRequest(postApiV1ThingsProductInfo__openAPI__delete, {
  manual: true,
  onSuccess: (response) => {
    if (response.code === ResponseCode.SUCCESS)
      window.$message.success('删除产品成功')
    else window.$message.error('删除产品失败')
    reloadTable()
  },
  onError: () => window.$message.error('删除产品错误'),
})

const handleEdit = (record: ProductListType) =>
  router.push({ name: 'productDetail', params: { productID: record?.productID } })

const handleDelete = (record: ProductListType) =>
  deleteProductRun({
    productID: record?.productID ?? '',
  })

const actionColumn = reactive({
  width: 220,
  title: '操作',
  key: 'actions',
  fixed: 'right',
  render(record: ProductListType) {
    return h(TableAction as any, {
      style: 'text',
      actions: [
        {
          label: '查看',
          type: 'primary',
          onClick: () => handleEdit(record),
          ifShow: () => {
            return true
          },
          auth: ['basic_list'],
        },
        {
          label: '删除',
          type: 'error',
          // 配置 color 会覆盖 type
          color: 'red',
          // onClick: handleDelete.bind(null, record),
          popConfirm: { confirm: () => handleDelete(record) },
          // 根据业务控制是否显示 isShow 和 auth 是并且关系
          ifShow: () => {
            return true
          },
          // 根据权限控制是否显示: 有权限，会显示，支持多个
          auth: ['basic_list'],
        },
      ],
    })
  },
})

const [register, {}] = useForm({
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  labelWidth: 100,
  schemas,
})

const addProduct = () =>
  showModal.value = true

const loadDataTable = async (page: BasicTableProps['page']) => {
  const rep = await postApiV1ThingsProductInfoIndex({ ...queryFormParams, ...page })
  const data = {
    list: rep?.data?.list,
    itemCount: rep?.data?.total,
  }
  return data
}

const confirmForm = (e: { preventDefault: () => void }) => {
  e.preventDefault()
  formBtnLoading.value = true
  formRef?.value?.validate((errors) => {
    if (!errors)
      addProductRun(modalFormParams)
    else
      window.$message.error('请填写完整信息')
    formBtnLoading.value = false
  })
}

const handleSubmit = () =>
  reloadTable()

const handleReset = () => {
  queryFormParams.deviceType = 0
  queryFormParams.productName = ''
  reloadTable()
}
</script>

<template>
  <n-space vertical>
    <div style="background-color: white" pt-20 pr-20>
      <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset">
        <template #statusSlot="{ model, field }">
          <n-input v-model:value="model[field]" />
        </template>
      </BasicForm>
    </div>
    <n-card>
      <BasicTable
        ref="actionRef"
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row: ProductListType) => row.productID"
        :action-column="actionColumn"
        :scroll-x="1090"
      >
        <template #tableTitle>
          <h3>
            产品列表
          </h3>
        </template>

        <template #toolbar>
          <n-button type="primary" @click="addProduct">
            新增
          </n-button>
        </template>
      </BasicTable>
    </n-card>
  </n-space>

  <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="创建产品" pl-30>
    <n-form
      ref="formRef"
      :model="modalFormParams"
      :rules="rules"
      label-placement="left"
      class="py-4"
    >
      <n-form-item label="产品名称" path="productName" ml-30>
        <n-input v-model:value="modalFormParams.productName" placeholder="请输入产品名" />
      </n-form-item>
      <n-form-item label="" path="inputProductID" ml-30>
        <n-switch v-model:value="modalFormParams.inputProductID">
          <template #checked>
            自定义产品id
          </template>
          <template #unchecked>
            产品id自动生成
          </template>
        </n-switch>
      </n-form-item>
      <n-form-item v-if="modalFormParams.inputProductID" path="productID" ml-30>
        <template #label>
          产品ID
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-icon size="18" class="cursor-pointer text-gray-400">
                <QuestionCircleOutlined />
              </n-icon>
            </template>
            长度必须为11个字符,且只能包含数字及大小写字母
          </n-tooltip>
        </template>
        <n-input v-model:value="modalFormParams.productID" placeholder="请输入产品ID" />
      </n-form-item>
      <n-form-item label="设备类型" path="deviceType" ml-30>
        <n-radio-group v-model:value="modalFormParams.deviceType">
          <n-space>
            <n-radio v-for="deviceType in DEVICE_TYPE_VALUE" :key="deviceType.value" :value="deviceType.value">
              {{ deviceType.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="认证方式" path="authMode" ml-30>
        <n-select v-model:value="modalFormParams.authMode" :options="AUTH_MODE_FORM" />
      </n-form-item>
      <n-form-item label="数据协议" path="dataProto" ml-30>
        <n-select v-model:value="modalFormParams.dataProto" :options="DATA_PROTO_FORM" />
      </n-form-item>
      <n-form-item label="通讯方式" path="netType" ml-30>
        <n-select v-model:value="modalFormParams.netType" :options="NET_TYPE_FORM" />
      </n-form-item>
      <n-form-item label="动态注册" path="autoRegister" ml-30>
        <n-select v-model:value="modalFormParams.autoRegister" :options="AUTO_REGISTER_FORM" />
      </n-form-item>
      <n-form-item label="产品描述" path="description" ml-30>
        <n-input
          v-model:value="modalFormParams.description"
          type="textarea"
          placeholder="请输入产品描述"
        />
      </n-form-item>
    </n-form>

    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">
          取消
        </n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">
          确定
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<style lang="less" scoped></style>
