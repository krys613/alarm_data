<template>
    <section class="chart-container">
        <el-row>
            <el-col :span="12">
                <div id="chartColumnBPC" style="width:1500px; height:400px;"></div>
            </el-col>
            <el-col :span="22">
                <div id="chartColumnTivoli" style="width:1500px; height:400px;"></div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'
    import $ from 'jquery'

    export default {
        data() {
            return {
                chartColumnBPC: null,
                chartColumnTivoli: null
            }
        },

        methods: {
            drawColumnChartBPC() {
                $.ajax({
                    type: 'get',
                    dataType: 'jsonp',
                    url: 'http://10.82.82.15/aiops/BPC/getAggregation',
                    jsonp: "callback",
                    success: function (data) {
                        this.chartColumnBPC = echarts.init(document.getElementById('chartColumnBPC'));
                        this.chartColumnBPC.setOption({
                            title: {
                                text: '某组件的成功率、响应率和交易量',
                                subtext: 'BPC 表'
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['成功率低于阈值', '响应率低于阈值 & 交易量高于阈值', '响应率低于阈值']
                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    magicType: {show: true, type: ['line', 'bar']},
                                    saveAsImage: {show: true}
                                }
                            },
                            calculable: true,
                            xAxis: [
                                {
                                    axisLabel: {
                                        interval: 0,
                                        rotate: 20
                                    },
                                    type: 'category',
                                    data: data.nameList
                                }
                            ],
                            grid: {bottom: '30%'},
                            yAxis: [
                                {
                                    type: 'value',
                                    name: '基于阈值的告警次数'
                                }
                            ],
                            series: [
                                {
                                    name: '成功率低于阈值',
                                    type: 'bar',
                                    data: data.lowSuccess,
                                    markPoint: {
                                        data: [
                                            {type: 'max', name: '最大值'},
                                            {type: 'min', name: '最小值'}
                                        ]
                                    },
                                    markLine: {
                                        data: [
                                            {type: 'average', name: '平均值'}
                                        ]
                                    }
                                },
                                {
                                    name: '响应率低于阈值 & 交易量高于阈值',
                                    type: 'bar',
                                    data: data.lowResponseHighTransaction,
                                    markPoint: {
                                        data: [
                                            {type: 'max', name: '最大值'},
                                            {type: 'min', name: '最小值'}
                                        ]
                                    },
                                    markLine: {
                                        data: [
                                            {type: 'average', name: '平均值'}
                                        ]
                                    }
                                },
                                {
                                    name: '响应率低于阈值',
                                    type: 'bar',
                                    data: data.lowResponseList,
                                    markPoint: {
                                        data: [
                                            {type: 'max', name: '最大值'},
                                            {type: 'min', name: '最小值'}
                                        ]
                                    },
                                    markLine: {
                                        data: [
                                            {type: 'average', name: '平均值'}
                                        ]
                                    }
                                }
                            ]
                        });
                    },
                    error: function (data) {
                        console.log('fail');
                    }
                })
            },
            drawColumnChartTivoli() {
                $.ajax({
                    type: 'get',
                    dataType: 'jsonp',
                    url: 'http://10.82.82.15/aiops/Tivoli/getAggregation',
                    jsonp: "callback",
                    success: function (data) {
                        this.chartColumnTivoli = echarts.init(document.getElementById('chartColumnTivoli'));
                        this.chartColumnTivoli.setOption({
                            title: {
                                text: '某业务的告警级别',
                                subtext: 'Tivoli 表'
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['告警级别为1', '告警级别为2', '告警级别为3', '告警级别为4', '告警级别为5']
                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    magicType: {show: true, type: ['line', 'bar']},
                                    saveAsImage: {show: true}
                                }
                            },
                            calculable: true,
                            xAxis: [
                                {
                                    axisLabel: {
                                        interval: 0,
                                        rotate: 30
                                    },
                                    type: 'category',
                                    data: data.nameList
                                }
                            ],
                            grid: {left: '10%', bottom: '20%'},
                            yAxis: [
                                {
                                    type: 'value',
                                    name: '告警次数'
                                }
                            ],
                            series: [
                                {
                                    name: '告警级别为1',
                                    type: 'bar',
                                    data: data.level1List,
                                    markPoint: {
                                        data: [
                                            {type: 'max', name: '最大值'},
                                            {type: 'min', name: '最小值'}
                                        ]
                                    },
                                    markLine: {
                                        data: [
                                            {type: 'average', name: '平均值'}
                                        ]
                                    }
                                },
                                {
                                    name: '告警级别为2',
                                    type: 'bar',
                                    data: data.level2List,
                                    markPoint: {
                                        data: [
                                            {type: 'max', name: '最大值'},
                                            {type: 'min', name: '最小值'}
                                        ]
                                    },
                                    markLine: {
                                        data: [
                                            {type: 'average', name: '平均值'}
                                        ]
                                    }
                                },
                                {
                                    name: '告警级别为3',
                                    type: 'bar',
                                    data: data.level3List,
                                    markPoint: {
                                        data: [
                                            {type: 'max', name: '最大值'},
                                            {type: 'min', name: '最小值'}
                                        ]
                                    },
                                    markLine: {
                                        data: [
                                            {type: 'average', name: '平均值'}
                                        ]
                                    }
                                },
                                {
                                    name: '告警级别为4',
                                    type: 'bar',
                                    data: data.level4List,
                                    markPoint: {
                                        data: [
                                            {type: 'max', name: '最大值'},
                                            {type: 'min', name: '最小值'}
                                        ]
                                    },
                                    markLine: {
                                        data: [
                                            {type: 'average', name: '平均值'}
                                        ]
                                    }
                                },
                                {
                                    name: '告警级别为5',
                                    type: 'bar',
                                    data: data.level5List,
                                    markPoint: {
                                        data: [
                                            {type: 'max', name: '最大值'},
                                            {type: 'min', name: '最小值'}
                                        ]
                                    },
                                    markLine: {
                                        data: [
                                            {type: 'average', name: '平均值'}
                                        ]
                                    }
                                }
                            ]
                        });
                    },
                    error: function (data) {
                        console.log('fail');
                    }
                })
            },


            drawCharts() {
                this.drawColumnChartBPC();
                this.drawColumnChartTivoli();
            },
        },

        mounted: function () {
            this.drawCharts()
        },
        updated: function () {
            this.drawCharts()
        }
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }

    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 30px 20px;
    }
</style>
