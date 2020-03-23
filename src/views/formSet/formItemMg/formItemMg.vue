<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="text-lable">项目名称：</span>
      <el-input v-model="listQuery.itemName" placeholder="请输入" clearable style="width: auto;" class="filter-item" @keyup.enter.native="handleSelect" />
      <span class="text-lable">项目类型：</span>
      <el-select v-model="listQuery.itemType" placeholder="请选择" clearable style="width: auto" class="filter-item">
        <el-option v-for="item in TypeOptions" :key="item.key" :label="item.value" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item search-btn" type="primary" @click="handleSelect">
        <span style="height:17px;line-height:17px;font-size:12px;padding-bottom:6px">搜索</span>
      </el-button>
    </div>
    <div class="panelBar">
      <ul class="toolBar">
        <li>
          <a @click="saveFormItem">
            <img src="../../../views/images/添加@2x.png" width="17px" height="17px" />
            <span class="barIcon">添加</span>
          </a>
        </li>
      </ul>
    </div>
    <!-- 表格 -->
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border :height="tableHeight"
      fit highlight-current-row stripe size="mini" style="width: 100%;" :cell-style="{padding:'3px 2px'}"
      :header-cell-style="{background:'#F0F5F7', color:'black'}" @row-dblclick="saveFormItem">
      <el-table-column label="项目代码" prop="itemCode" align="center" width="auto" />
      <el-table-column label="项目名称" prop="itemName" align="center" width="auto" />
      <el-table-column label="项目类型" prop="itemType" align="center" width="auto">
        <template slot-scope="scope">
          {{ mapData[scope.row.itemType] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="formOperateType" align="center" min-width="80px">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="setFormItem(scope)">修改</el-button>
          <el-button type="text" size="mini" @click.native.prevent="deleteRow(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 记录条数 分页-->
    <pagination :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"
                @pagination="getPage"/>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/_components/Pagination'
import { TypeOptions, getFormItemPage, deleteItem } from '@/api/form'

export default {
  name: 'FormItemMg',
  components: { Pagination },
  directives: { waves },
  props: {
    model: { type: Object }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      ableCheck: false,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        itemName: undefined,
        itemType: undefined
      },
      mapData: {},
      TypeOptions,
    }
  },
  // 表格高度
  computed: {
    tableHeight() {
      return window.innerHeight - 275
    }
  },
  created() {
    this.getPage()
    this.initType()
  },
  methods: {
    getPage() {
      const data = {
        pageIndex: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize,
        itemName: this.listQuery.itemName,
        itemType: this.listQuery.itemType
      }
      getFormItemPage(data).then(response => {
        this.list = response.data.list
        this.total = response.data.count
        if (this.list.length === 0) {
          this.$confirm('未搜到相关表单项目！', '搜索提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getPage()
    },
    handleSelect() {
      if (this.listQuery.itemName !== '' && this.listQuery.itemType !== '') {
        this.listQuery.page = 1
        this.getPage()
      } else { // 全空做刷新
        this.listQuery.page = 1
        this.getPage()
      }
    },
    setFormItem(scope) {
      this.$router.push({
        path: import('@/views/formSet/formItemMg/setFormItem'),
        name: 'setFormItem',
        query: {
          itemCode: scope.row.itemCode,
          show: true
        }
      })
    },
    saveFormItem() {
      this.$router.push({
        path: import('@/views/formSet/formItemMg/setFormItem'),
        name: 'setFormItem',
        query: {
          show: false
        }
      })
    },
    formatType(row, column, cellValue) {
      for (const i in this.TypeOptions) {
        if (cellValue === this.TypeOptions[i].key) {
          return this.TypeOptions[i].value
        }
      }
    },
    initType() {
      for (const i in this.TypeOptions) {
        this.$set(this.mapData, this.TypeOptions[i].key, this.TypeOptions[i].value)
      }
    },
    deleteRow(scope) {
      this.$confirm('确定删除?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteItem(scope.row.itemCode).then( response => {
          if (response.code == 200){
            this.list.splice(scope.$index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })

    }
  }
}
</script>

<style scoped>

</style>
