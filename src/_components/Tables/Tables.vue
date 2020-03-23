<template>
  <!-- 列表 -->
  <el-table
    ref="refTable"
    v-loading="listLoading"
    stripe
    :border="border"
    :data="dataSource"
    highlight-current-row
    @selection-change="handleSelectionChange"
    @row-dblclick="rowClick"
    @row-click="clickTable"
    @expand-change="expandChange"
  >
    <!--数据源-->
    <el-table-column
      :key="tableKey"
      v-loading="listLoading"
      :list="list"
      :data="tableData"
      :columns="columns"
      border
      height="400"
      fit
      highlight-current-row
      stripe
      style="width: 100%;"
      :header-cell-style="{background:'#F0F5F7', color:'black'}"
      @sort-change="sortChange"
    />
  </el-table>
</template>
<script>
export default {
  name: 'Tables',
  props: {
    dataSource: { // 表格数据源
      type: Array,
      default: () => []
    },
    columns: { // 表格的字段展示
      type: Array,
      default: () => []
    }
  }
}
</script>
