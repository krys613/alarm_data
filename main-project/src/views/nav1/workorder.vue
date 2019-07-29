<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-select v-model="filters.status" placeholder="工单状态">
                        <el-option
                                v-for="item in selectList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="postInfo-container-item">
                    <el-date-picker v-model="filters.duration" type="datetimerange"
                                    placeholder="触发时间" align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getWorkOrder()">查询</el-button>
                </el-form-item>
                <!--<el-form-item>-->
                <!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
                <!--</el-form-item>-->
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="work_order" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" min-width="55">
            </el-table-column>
            <el-table-column prop="id" label="工单编号" min-width="80">
            </el-table-column>
            <el-table-column prop="trigger_time" label="触发时间" width="200">
            </el-table-column>
            <el-table-column prop="root_event" label="根源告警" width="200">
            </el-table-column>
            <el-table-column prop="info" label="告警信息" min-width="700">
            </el-table-column>
            <el-table-column prop="status" label="状态" width="120">
                <template slot-scope="scope">
                    <el-tag
                            plain
                            size="mini"
                            :type="scope.row.status=='已完成' ? 'success' : (scope.row.status=='处理中'? 'warning' : 'error')">
                        {{scope.row.status}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button type="danger" size="small" v-if="scope.row.status=='处理中'" @click="handleComp(scope.$index, scope.row)">完成</el-button>
                    <el-button type="danger" size="small" v-else-if="scope.row.status=='已完成'" @click="handleDel(scope.$index, scope.row)" style="display: none">删除</el-button>
                    <div v-else>
                        <el-button type="danger" size="small" @click="handleReceive(scope.$index, scope.row)">接受</el-button>
                        <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">拒绝</el-button>
                    </div>

                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {getWorkOrderListPage, receiveWorkOrder, completeWorkOrder, rejectWorkOrder} from '../../api/api';
    import $ from 'jquery'


    export default {
        data() {
            return {
                filters: {
                    status: '',
                    duration: ''
                },
                work_order: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                selectList:[//状态列表
                    {value: 1, label: '待处理'},
                    {value: 2, label: '处理中'},
                    {value: 3, label: '已完成'},
                ]
            }
        },

        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getWorkOrder();
            },
            //获取用户列表
            formatTen(num) {
                return num > 9 ? (num + "") : ("0" + num);
            },
            getWorkOrder() {
                let startDate = "";
                let endDate = "";
                if (this.filters.duration) {
                    console.log(this.filters.duration);
                    let start = this.filters.duration[0];
                    if (start != null) {
                        startDate = start.getFullYear() + '-' + this.formatTen(start.getMonth() + 1) + '-' +
                            this.formatTen(start.getDate()) + ' ' + this.formatTen(start.getHours()) + ':' +
                            this.formatTen(start.getMinutes()) + ':' + this.formatTen(start.getSeconds());
                    }

                    let end = this.filters.duration[1];
                    if (end != null) {
                        endDate = end.getFullYear() + '-' + this.formatTen(end.getMonth() + 1) + '-' +
                            this.formatTen(end.getDate()) + ' ' + this.formatTen(end.getHours()) + ':' +
                            this.formatTen(end.getMinutes()) + ':' + this.formatTen(end.getSeconds());
                    }
                }
                console.log(startDate, endDate);
                let para = {
                    page: this.page,
                    status: this.filters.status,
                    startDate: startDate,
                    endDate: endDate
                };
                this.listLoading = true;
                //NProgress.start();
                getWorkOrderListPage(para).then((res) => {
                    this.total = res.total;
                    this.work_order = res.work_order;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //接受工单
            handleReceive:function(index, row) {
                this.$confirm('确认接受该工单？', '提示', {
                    type:'warning'
                }).then(() => {
                    let para = {
                        id: row.id
                    };
                    receiveWorkOrder(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.getWorkOrder();
                    });
                }).catch(() => {
                });
            },
            //拒绝工单
            handleDel: function (index, row) {
                this.$confirm('确认拒绝该工单吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.id};
                    rejectWorkOrder(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.getWorkOrder();
                    });
                }).catch(() => {

                });
            },
            //完成工单
            handleComp:function(index, row){
                this.$confirm('确认已完成该工单？', '提示', {
                    type:'warning'
                }).then(() => {
                    let para = {
                        id: row.id
                    };
                    completeWorkOrder(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.getWorkOrder();
                    });
                }).catch(() => {
                });
            },

            selsChange: function (sels) {
                this.sels = sels;
            }
        },
        mounted() {
            this.getWorkOrder();
        }
    }

</script>

<style scoped>

</style>