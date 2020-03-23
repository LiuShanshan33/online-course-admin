 //护理等级
<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">护理等级</div>
      <hr>
      <el-button
        class="create-btn"
        style="margin-top: 20px;margin-bottom: 10px;"
        type="primary"
      >新建</el-button>
    </div>
    <div class="bottom-container">
      <div class="down-tree" :style="conheight" style="width: 20%">
        <!-- tree -->
        <el-scrollbar style="height:100%">
          <el-tree
            v-loading="listLoading"
            :data="list"
            :props="defaultProps"
            @node-click="handleNodeClick"
          />
        </el-scrollbar>
      </div>
      <div v-show="seen" class="right-container">
        <div class="scoll" :style="conheight">
          <el-scrollbar style="height:100%">
            <div style="margin-top:10px">
              <el-checkbox v-model="inherit" style="margin-bottom:10px">使用默认</el-checkbox><br>
              <el-button
                v-if="!inherit"
                style="margin-bottom: 10px;"
                class="add-botton"
                @click="AddItems"
              ><span>添加</span>
              </el-button>
              <el-table
              :key="tableKey"
              :data="gradeList"
              size="mini"
              border
              fit
              highlight-current-row
              stripe
              style="width: 80%;"
              :header-cell-style="{background:'#F0F5F7'}"
              :cell-style="{padding:'3px 2px'}"
            >
              <el-table-column label="措施内容" prop="content" align="left" min-width="160px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.content" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="标题" prop="title" align="left" width="140px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.title" size="small" />
                </template>
              </el-table-column>
              <!-- <el-table-column label="排序" prop="sort" type="index" align="left" width="70px" /> -->
              <el-table-column label="执行次数" prop="times" type="index" align="left" width="100px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.times" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="执行时间点" prop="timePoint" type="index" align="left" width="140px">
                <template slot-scope="scope">
                  <el-time-select
                    v-model="scope.row.timePoint"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '24:00'
                    }"
                    placeholder="选择时间"
                    style="margin-top:7px;width:110px!important"
                    >
                  </el-time-select>
                </template>
              </el-table-column>
              <el-table-column label="排序" prop="sort" type="index" align="left" width="80px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.sort" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="操作" align="left" min-width="80">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click.native.prevent="deleteRow(scope.$index)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top: 10px">
              <el-button class="create-btn add-botton" style="margin-bottom: 10px;" type="primary" @click="saveItems(form)">
                保存
              </el-button>
            </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { getDictInfo, getMeasureList } from '@/api/user'
import { saveGrade } from '@/api/addOrSave'
export default {
  // name: 'Grade',
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      form: {
        label: '',
        deptCode: '',
        code: ''
      },
      gradeList: null, //护理等级列表
      tableKey: 0,
      inherit: false, // 使用默认
      // 给一个高度
      conheight: {
        height: ''
      },
      listLoading: true,
      seen: false,
      list: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.onLoad()
    // window.addEventListener('resize', this.getHeight)
    this.tableHeight()
  },
  methods: {
    onLoad() {
      this.getTreeData()
    },
    tableHeight() {
      this.conheight.height = window.innerHeight - 232 + 'px'
      console.log('当前液面高度', window.innerHeight)
    },
    getTreeData() {
      getDictInfo().then(res => {
        const treeList = []
        res.data.list.map((item, index) => {
          treeList.push({
            label: item.name,
            children: [
              {
                label: '特级护理',
                code: item.code
              },
              {
                label: '一级护理',
                code: item.code
              },
              {
                label: '二级护理',
                code: item.code
              },
              {
                label: '三级护理',
                code: item.code
              }
            ],
            code: item.code
          })
        })
        console.log('treeList', treeList)
        this.list = treeList
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 添加一行
    AddItems() {
        this.gradeList.push({
          content: '',
          title: '',
          times: 1,
          timePoint: '',
          sort: this.gradeList.length + 1
      })
    },
    // // 删除该行
    deleteRow(index, rows) {
      this.gradeList.splice(index, 1)
      console.log(this.gradeList)
    },
    // 点击树触发
    handleNodeClick: function(data) {
      this.seen = true
      // this.form.label = encodeURI(uri:(data.label))
      console.log('护理等级',encodeURI(data.label))
      this.form.label = encodeURI(data.label)
      this.form.code = data.label
      console.log('护理等级',this.form.label)
      console.log('护理单元编码', data.code)
      console.log('data', data)
      this.form.deptCode = data.code
      if (data && data.code) {
        getMeasureList(data.code, this.form.label).then(res => {
          this.gradeList = res.data
          console.log('gradeList', res.data)
        })
      }
    },
    // 保存
    saveItems() {
      const data = {
        deptCode: this.form.deptCode,
        code: this.form.code,
        inherit: this.inherit,
        itemList: this.gradeList
      }
    saveGrade(data).then(response => {
        console.log('data', data)
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.top-container {
  margin: 20px 12px 5px 12px;
  .content-title {
    width: 120px;
    height: 30px;
    font-size: 15px;
    font-family: STSongti-SC-Black, STSongti-SC;
    font-weight: 900;
    color: rgba(51, 51, 51, 1);
    line-height: 25px;
    border-bottom: 3px solid #419793;
  }
  hr {
    width: 100%;
    margin: 0 auto;
    border: 0;
    height: 0;
    border-bottom: 1px solid rgba(203, 203, 203, 1);
  }
  .create-btn {
    width: 75px;
    height: 30px;
    background: linear-gradient(
      180deg,
      rgba(241, 246, 249, 1) 0%,
      rgba(214, 224, 229, 1) 54%,
      rgba(236, 241, 243, 1) 100%
    );
    border-radius: 2px;
    border: 1px solid rgba(204, 204, 204, 1);
    font-size: 12px;
    font-family: STSongti-SC-Bold, STSongti-SC;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    line-height: 17px;
    padding: 3px;
  }
}
.bottom-container {
  display: flex;
  flex-direction: row;
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .down-tree {
    flex: 1;
    float: left;
    max-width: 200px;
    background: rgba(245, 248, 250, 1);
    border-radius: 3px;
    border: 1px solid rgba(211, 219, 222, 1);
    margin-left: 12px;
    padding: 10px;
    /deep/.el-scrollbar {
      // height: 368px;
      /deep/.el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
    /deep/.el-tree {
      background: rgba(245, 248, 250, 1);
    }
  }

  .right-container {
    flex: 5;
    border-radius: 3px;
    border: 1px solid rgba(211, 219, 222, 1);
    border-width: 1px 1px 1px 0px;
    margin-right: 12px;
    padding-left: 30px;
    .top-form {
      margin-top: 30px;
      .el-form-item {
        width: 600px;
        margin-bottom: 15px;
        font-family: STSongti-SC-Bold, STSongti-SC;
        font-weight: bold;
        line-height: 17px;
        /deep/.el-form-item__label {
          color: rgba(51, 51, 51, 1) !important;
          font-size: 12px;
          font-family: STSongti-SC-Bold, STSongti-SC;
        }
        /deep/.el-input--medium .el-input__inner {
          height: 30px !important;
          line-height: 30px !important;
        }
      }
    }
    /deep/.tabs-form {
      .el-form-item {
        width: 540px !important;
        font-family: STSongti-SC-Bold, STSongti-SC;
        font-weight: bold;
        line-height: 17px;
        .el-select .el-input {
          width: 440px;
        }
        /deep/.el-form-item__label {
          color: rgba(51, 51, 51, 1) !important;
          font-size: 12px;
          font-family: STSongti-SC-Bold, STSongti-SC;
        }
        /deep/.el-input--medium .el-input__inner {
          height: 30px !important;
          line-height: 30px !important;
        }
      }
      .el-textarea__inner {
        min-height: 80px !important;
      }
    }
  }
}
</style>
