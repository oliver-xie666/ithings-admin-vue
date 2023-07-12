import type { TableBaseColumn } from 'naive-ui/lib/data-table/src/interface'
import type { ComponentType } from './componentType'
import type { Recordable } from '~/types/global'

export interface BasicColumn extends TableBaseColumn {
  // 编辑表格
  edit?: boolean
  editRow?: boolean
  editable?: boolean
  editComponent?: ComponentType
  editComponentProps?: Recordable
  editRule?: boolean | ((text: string, record: Recordable) => Promise<string>)
  editValueMap?: (value: any) => string
  onEditRow?: () => void
  // 权限编码控制是否显示
  auth?: string[]
  // 业务控制是否显示
  ifShow?: boolean | ((column: BasicColumn) => boolean)
  // 控制是否支持拖拽，默认支持
  draggable?: boolean
}

export interface TableActionType {
  reload: (opt) => Promise<void>
  emit?: any
  getColumns: (opt?) => BasicColumn[]
  setColumns: (columns: BasicColumn[] | string[]) => void
}

export interface BasicTableProps {
  title?: string
  dataSource: Function
  columns: any[]
  pagination: object
  showPagination: boolean
  actionColumn: any[]
  canResize: boolean
  resizeHeightOffset: number
  loading: boolean
  page?: {
    page: {
      page: number
      size: number
    }
  }
}

