<template>
    <section>

        <!--列表-->
        <el-table :data="rules" highlight-current-row v-loading="listLoading" @selection-change="selsChange">
            <el-table-column type="selection" min-width="80">
            </el-table-column>
            <el-table-column type="index" width="100">
            </el-table-column>
            <el-table-column prop="source" label="根因事件" min-width="250" sortable>
            </el-table-column>
            <el-table-column prop="target" label="关联事件" min-width="250" sortable>
            </el-table-column>
            <el-table-column prop="confidence" label="置信度" min-width="100" sortable>
            </el-table-column>
            <el-table-column label="操作" min-width="100">
                <template scope="scope">
                    <el-button type="danger" size="small" @click="handleCon(scope.$index, scope.row)">确认</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchConfirm" :disabled="this.sels.length===0">批量确认</el-button>
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>
    </section>
</template>

<script>
    import {getRulesListPage, batchRemoveRules, removeRules, confirmRules, batchConfirmRules} from '../../api/api'

    export default {
        data() {
            return {
                rules: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: []//列表选中列
            }
        },

        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getRules();
            },
            //获取关联规则列表
            getRules() {
                let para = {
                    page: this.page
                };
                this.listLoading = true;
                //NProgress.start();
                getRulesListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.rules = res.data.rules;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //确认
            handleCon: function (index, row) {
                this.$confirm('确认将该记录添加入关联规则库吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.id};
                    confirmRules(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: res.num.toString() + '条记录添加成功',
                            type: 'success'
                        });
                        this.getRules();
                    });
                }).catch(() => {

                });
            },
            //批量确认
            batchConfirm: function () {
                let ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认将选中记录添加入关联规则库吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {ids: ids};
                    batchConfirmRules(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: res.num.toString() + '条记录添加成功',
                            type: 'success'
                        });
                        this.getRules();
                    });
                }).catch(() => {

                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.id};
                    removeRules(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: res.num.toString() + '条记录删除成功',
                            type: 'success'
                        });
                        this.getRules();
                    });
                }).catch(() => {

                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                let ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {ids: ids};
                    batchRemoveRules(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: res.num.toString() + '条记录删除成功',
                            type: 'success'
                        });
                        this.getRules();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getRules();
        }
    }

</script>

<style scoped>

</style>
