<template>
  <div class="app-container">
    <div v-show="listQuery.parentId" class="top-container">
      <p>
        父模块：
        <span>{{ map[ listQuery.parentId ] }}</span>
      </p>
    </div>
    <!-- 工具栏 -->
    <div class="panelBar">
      <ul class="toolBar">
        <li v-show="listQuery.parentId">
          <a @click="upperLevel">
            <img src="../../../views/images/添加@2x.png" width="17px" height="17px">
            <span class="barIcon">返回上一级</span>
          </a>
        </li>
        <li>
          <a @click="addModuleMg">
            <img src="../../../views/images/添加@2x.png" width="17px" height="17px">
            <span class="barIcon">添加</span>
          </a>
        </li>
        <li>
          <a @click="updateModuleMg">
            <img src="../../../views/images/编辑@2x.png" width="17px" height="17px">
            <span class="barIcon">修改</span>
          </a>
        </li>
        <li>
          <a>
            <img src="../../../views/images/删 除@2x.png" width="17px" height="17px">
            <span class="barIcon">删除</span>
          </a>
        </li>
      </ul>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      size="mini"
      border
      :height="tableHeight"
      fit
      highlight-current-row
      stripe
      style="width: 100%;"
      :cell-style="{padding:'3px 2px'}"
      :header-cell-style="{background:'#F0F5F7', color:'#333333'}"
      :default-sort="{prop: 'id', order: 'ascending'}"
      @row-click="checkViews"
      @row-dblclick="updateModuleMg"
    >
      <el-table-column label="ID" prop="id" align="center" width="60px" />
      <el-table-column label="名称" prop="name" align="center" min-width="100px" />
      <el-table-column
        label="是否菜单"
        prop="menu"
        align="center"
        class-name="status-col"
        min-width="100"
      >
        <template slot-scope="scope">{{ mapMenu[scope.row.menu] }}</template>
      </el-table-column>
      <el-table-column label="地址" prop="url" align="center" min-width="400px" />
      <el-table-column label="父模块" prop="parentId" align="center" min-width="100px">
        <template slot-scope="scope">{{ map[scope.row.parentId] }}</template>
      </el-table-column>
      <el-table-column
        label="排序"
        prop="sort"
        align="center"
        class-name="status-col"
        min-width="100"
      />
      <el-table-column
        label="操作"
        prop="formOperateType"
        align="center"
        min-width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="text" size="mini" @click="getModulePage(row)">子模块管理</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getPage_9 } from '@/api/user'
import { getAllMenu } from '@/api/addOrSave'

export default {
  name: 'ModuleMg',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      mapMenu: {
        true: '是',
        false: '否'
      },
      map: {},
      affixId: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        parentId: '',
        menu: ''
      }
    }
  },
  // 表格高度
  computed: {
    tableHeight() {
      return window.innerHeight - 225
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getPage_9(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.count

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 点击某行事件
    checkViews(data) {
      this.form = data
      this.ableCheck = true
    },
    // 返回上一级
    upperLevel() {
      this.mName = this.map.name
      if (this.listQuery.parentId) {
        this.listQuery.parentId = this.affixId.pop()
        this.getList()
      }
    },
    // 添加
    addModuleMg() {
      this.$router.push({
        path: '../SystemMg/addModuleMg'
      })
    },
    // 修改
    updateModuleMg(form) {
      if (this.ableCheck) {
        this.$router.push({
          path: '../SystemMg/updateModuleMg',
          query: {
            id: this.form.id,
            name: this.form.name,
            url: this.form.url,
            authUrl: this.form.authUrl,
            attached: this.form.attached,
            parentId: this.form.parentId,
            menu: this.form.menu,
            sort: this.form.sort
          }
        })
      } else {
        this.$confirm('请先选择表单', '查看提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
    getModulePage(row) {
      // 设置parentId为map的id，查找相应的name
      getAllMenu().then(response => {
        const list = response.data.list
        for (const i in list) {
          this.$set(this.map, list[i].id, list[i].name)
        }
      })
      this.affixId.push(row.parentId)
      this.listQuery.parentId = row.id
      this.getList()
    }
  }
}
</script>
