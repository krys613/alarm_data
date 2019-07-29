<template>
    <section class="chart-container">
        <el-row>
            <el-col :span="24" class="toolbar" style="padding-top: 10px; padding-bottom: 0px;">
                <el-form :inline="true">
                    <el-form-item class="postInfo-container-item">
                        <el-date-picker
                                type="date"
                                placeholder="请输入查询的起始时间"
                                align="right"
                                value-format="yyyy-MM-dd"
                                @change="getstartTime"
                                v-model="timestart">
                        </el-date-picker>
                        <el-date-picker
                                type="date"
                                placeholder="请输入查询的终止时间"
                                align="right"
                                value-format="yyyy-MM-dd"
                                @change="getendTime"
                                v-model="timeend">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="12">
                <div id="chartBubble1" style="width:1500px; height:400px;"></div>
            </el-col>
            <el-col :span="21">
                <div id="chartBubble2" style="width:1500px; height:400px;"></div>
            </el-col>
            <el-col :span="22">
                <div id="chartBubble3" style="width:1500px; height:400px;"></div>
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
                chartBubble1: null,
                chartBubble2: null,
                chartBubble3: null,
                timestart: '',
                timeend: '',
            }
        },

        methods: {
            getstartTime(time) {
                this.timestart = time
            },
            getendTime(time) {
                this.timeend = time
            },
            drawBubbleChart() {
                var duration = {};
                if (this.timestart == '' && this.timeend == '') {
                    duration = {}
                } else if(this.timestart == ''){
                    duration = {
                        'endDate':this.timeend
                    }
                }else if(this.timeend == ''){
                    duration = {
                        'startDate':this.timestart
                    }
                }else{
                    duration = {
                        'startDate': this.timestart,
                        'endDate': this.timeend
                    }
                }
                $.ajax({
                    type: 'get',
                    dataType: 'jsonp',
                    url: 'http://10.82.82.15/aiops/BPC/getWarning',
                    jsonp: "callback",
                    data: duration,
                    success: function (data) {
                        var dataTest = JSON.parse(JSON.stringify(data));

                        //抽取所有时间值
                        function timeData() {
                            var timeData = [];
                            if (!dataTest == []) {
                                for (var i = 0; i < dataTest.length; i++) {
                                    var arr = dataTest[i].triggerTimes;
                                    timeData = timeData.concat(arr);
                                }
                            }
                            timeData.sort();
                            return timeData;
                        }

                        var timeData = timeData();

                        //处理数据生成对应3个事件的数据集
                        function dataProcess() {
                            //用于保存不同事件的全部按组件统计的告警信息
                            var data1 = [];
                            var data2 = [];
                            var data3 = [];
                            //用于保存不同事件的组件名集合
                            var dataSources1 = [];
                            var dataSources2 = [];
                            var dataSources3 = [];
                            //对每一个组件
                            if (!dataTest == []) {
                                for (var i = 0; i < dataTest.length; i++) {
                                    var len = dataTest[i].triggerTimes.length;
                                    //用于保存当前组件的告警集合
                                    var dataTemp1 = [];
                                    var dataTemp2 = [];
                                    var dataTemp3 = [];
                                    //对当前组件的每一条告警
                                    for (var j = 0; j < len; j++) {
                                        //用于保存当前告警的字段信息
                                        var temp1 = [];
                                        var temp2 = [];
                                        var temp3 = [];
                                        var event = dataTest[i].events[j];
                                        if (event == 1) {
                                            temp1[0] = dataTest[i].triggerTimes[j];
                                            temp1[1] = dataTest[i].latestWarningValues[j];
                                            temp1[2] = dataTest[i].thresholds[j];
                                            temp1[3] = dataTest[i].transactionValues[j];
                                            temp1[4] = dataTest[i].transactionThresholds[j];
                                            temp1[5] = dataTest[i].events[j];
                                            if (temp1 != []) {
                                                dataTemp1.push(temp1);
                                            }
                                        }
                                        if (event == 2) {
                                            temp2[0] = dataTest[i].triggerTimes[j];
                                            temp2[1] = dataTest[i].latestWarningValues[j];
                                            temp2[2] = dataTest[i].thresholds[j];
                                            temp2[3] = dataTest[i].transactionValues[j];
                                            temp2[4] = dataTest[i].transactionThresholds[j];
                                            temp2[5] = dataTest[i].events[j];
                                            if (temp2 != []) {
                                                dataTemp2.push(temp2);
                                            }
                                        }
                                        if (event == 3) {
                                            temp3[0] = dataTest[i].triggerTimes[j];
                                            temp3[3] = dataTest[i].latestWarningValues[j];
                                            temp3[4] = dataTest[i].thresholds[j];
                                            temp3[1] = dataTest[i].transactionValues[j];
                                            temp3[2] = dataTest[i].transactionThresholds[j];
                                            temp3[5] = dataTest[i].events[j];
                                            if (temp3 != []) {
                                                dataTemp3.push(temp3);
                                            }
                                        }
                                    }
                                    if (dataTemp1.length != 0) {
                                        data1.push(dataTemp1);
                                        dataSources1.push(dataTest[i].source);
                                    }
                                    if (dataTemp2.length != 0) {
                                        data2.push(dataTemp2);
                                        dataSources2.push(dataTest[i].source);
                                    }
                                    if (dataTemp3.length != 0) {
                                        data3.push(dataTemp3);
                                        dataSources3.push(dataTest[i].source);
                                    }
                                }
                            }
                            return {
                                data1: data1,
                                data2: data2,
                                data3: data3,
                                dataSources1: dataSources1,
                                dataSources2: dataSources2,
                                dataSources3: dataSources3
                            };
                        }

                        var data = dataProcess();
                        var data1 = data.data1;
                        var data2 = data.data2;
                        var data3 = data.data3;
                        var dataSources1 = data.dataSources1;
                        var dataSources2 = data.dataSources2;
                        var dataSources3 = data.dataSources3;

                        //图一默认只显示一个组件
                        function legend1() {
                            var dic = {};
                            for (var i = 1; i < data1.length; i++) {
                                dic[dataSources1[i]] = false;
                            }
                            var legend1 = {
                                y: 'top',
                                x: 'center',
                                padding: [0, 5, 5, 500],
                                itemGap: 8,
                                itemWidth: 10,
                                itemHeight: 10,
                                data: dataSources1,
                                textStyle: {
                                    color: '#000000',
                                    fontSize: 12
                                },
                                selected: dic
                            };
                            return legend1;
                        }

                        var legend1 = legend1();
                        //通用字典
                        var colors = [
                            "#2AE0C8", "#6B76FF", "#78B0A0", "#6bd382", "#aede66", "#94D2E6", "#aede66", "#A5AEFF", "#A8B6BF", "#ACF6EF", "#BDF3D4", "#BEC1FA", "#C0DFD9", "#C8E4FE", "#CBF5FB", "#D2E1C8", "#E3C887", "#E6CF8B", "#E6E2C3", "#EDD9C0", "#EED815", "#EF5A5A", "#F16F6F", "#F2B632", "#F67970", "#F7F4E3", "#F8D0B0", "#F9C4AA", "#FAD8BE", "#FAEF96", "#FBB8AC", "#FE6673", "#FEE4A6", "#FEFFDF", "#FEFFE0", "#FF7148", "#FFA952", "#FFBCE1", "#FFC0C2", "#FFE79A"
                        ];
                        var schema = [
                            {name: 'triggerTimes', index: 0, text: '时间'},
                            {name: 'latestWarningValues', index: 1, text: '告警值'},
                            {name: 'thresholds', index: 2, text: '阈值'},
                            {name: 'transactionValues', index: 3, text: '交易量'},
                            {name: 'transactionThresholds', index: 4, text: '交易量阈值'},
                            {name: 'events', index: 5, text: '事件类型'}
                        ];
                        var itemStyle = {
                            normal: {
                                opacity: 0.8,
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        };
                        var dataZoom = [
                            {
                                show: true,
                                realtime: true,
                                start: 30,
                                end: 70,
                                xAxisIndex: 0
                            },
                            {
                                type: 'inside',
                                realtime: true,
                                start: 30,
                                end: 70,
                                xAxisIndex: 0
                            }
                        ];
                        var tooltip = {
                            padding: 10,
                            backgroundColor: '#222',
                            borderColor: '#777',
                            borderWidth: 1,
                            formatter: function (obj) {
                                var value = obj.value;
                                return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                                    + obj.seriesName + ' ' + value[0]
                                    + '</div>'
                                    + schema[1].text + '：' + value[1] + '<br>'
                                    + schema[2].text + '：' + value[2] + '<br>'
                                    ;
                            }
                        };
                        //对不同事件生成不同的数据集series
                        var series1 = [];
                        var series2 = [];
                        var series3 = [];
                        for (var i = 0; i < data1.length; i++) {
                            series1.push({
                                name: dataSources1[i],
                                type: 'scatter',
                                itemStyle: itemStyle,
                                data: data1[i]
                            });
                        }
                        for (var i = 0; i < data2.length; i++) {
                            series2.push({
                                name: dataSources2[i],
                                type: 'scatter',
                                itemStyle: itemStyle,
                                data: data2[i]
                            });
                        }
                        for (var i = 0; i < data3.length; i++) {
                            series3.push({
                                name: dataSources3[i],
                                type: 'bar',
                                itemStyle: itemStyle,
                                data: data3[i]
                            });
                        }

                        this.chartBubble1 = echarts.init(document.getElementById('chartBubble1'));
                        this.chartBubble1.setOption({
                            title: {
                                text: '响应率告警值-最后告警时间',
                                subtext: 'BPC 表'
                            },
                            color: colors
                            ,
                            legend: legend1,
                            //横坐标缩放
                            dataZoom: dataZoom,
                            //提示框：悬停显示信息
                            tooltip: tooltip,
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: timeData,
                                name: '最后告警时间',
                                nameGap: 16,
                                nameTextStyle: {
                                    color: '#000000',
                                    fontSize: 12
                                },
                                splitLine: {
                                    show: false
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: '#000000'
                                    },
                                    onZero: true
                                }
                            },
                            yAxis: [
                                {
                                    type: 'value',
                                    name: '告警值',
                                    nameLocation: 'end',
                                    nameGap: 14,
                                    nameTextStyle: {
                                        color: '#000000',
                                        fontSize: 12
                                    },
                                    axisLine: {
                                        lineStyle: {
                                            color: '#000000'
                                        }
                                    },
                                    splitLine: {
                                        show: false
                                    },
                                    axisLabel: {
                                        formatter: '{value} %'
                                    }
                                }
                            ],
                            series: series1
                        });
                        this.chartBubble2 = echarts.init(document.getElementById('chartBubble2'));
                        this.chartBubble2.setOption({
                            title: {
                                text: '成功率告警值-最后告警时间',
                                subtext: 'BPC 表'
                            },
                            color: colors
                            ,
                            legend: {
                                y: 'top',
                                x: 'center',
                                padding: [0, 5, 5, 500],
                                itemGap: 8,
                                itemWidth: 10,
                                itemHeight: 10,
                                data: dataSources2,
                                textStyle: {
                                    color: '#000000',
                                    fontSize: 12
                                }
                            },
                            //横坐标缩放
                            dataZoom: dataZoom,
                            //提示框：悬停显示信息
                            tooltip: tooltip,
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: timeData,
                                name: '最后告警时间',
                                nameGap: 16,
                                nameTextStyle: {
                                    color: '#000000',
                                    fontSize: 12
                                },
                                splitLine: {
                                    show: false
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: '#000000'
                                    },
                                    onZero: true
                                }
                            },
                            yAxis: [
                                {
                                    type: 'value',
                                    name: '告警值',
                                    nameLocation: 'end',
                                    nameGap: 14,
                                    nameTextStyle: {
                                        color: '#000000',
                                        fontSize: 12
                                    },
                                    axisLine: {
                                        lineStyle: {
                                            color: '#000000'
                                        }
                                    },
                                    splitLine: {
                                        show: false
                                    },
                                    axisLabel: {
                                        formatter: '{value} %'
                                    }
                                }
                            ],
                            series: series2
                        });
                        this.chartBubble3 = echarts.init(document.getElementById('chartBubble3'));
                        this.chartBubble3.setOption({
                            title: {
                                text: '交易量告警值-最后告警时间',
                                subtext: 'BPC 表'
                            },
                            color: colors
                            ,
                            legend: {
                                y: 'top',
                                x: 'center',
                                padding: [0, 5, 5, 500],
                                itemGap: 8,
                                itemWidth: 10,
                                itemHeight: 10,
                                data: dataSources3,
                                textStyle: {
                                    color: '#000000',
                                    fontSize: 12
                                }
                            },
                            //横坐标缩放
                            dataZoom: dataZoom,
                            //提示框：悬停显示信息
                            tooltip: tooltip,
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: timeData,
                                name: '最后告警时间',
                                nameGap: 16,
                                nameTextStyle: {
                                    color: '#000000',
                                    fontSize: 12
                                },
                                splitLine: {
                                    show: false
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: '#000000'
                                    },
                                    onZero: true
                                }
                            },
                            yAxis: [
                                {
                                    type: 'value',
                                    name: '交易量',
                                    min: 0,
                                    max: 100,
                                    nameLocation: 'end',
                                    nameGap: 20,
                                    nameTextStyle: {
                                        color: '#000000',
                                        fontSize: 16
                                    },
                                    axisLine: {
                                        LineStyle: {
                                            color: '#000000'
                                        }
                                    },
                                    splitLine: {
                                        show: false
                                    }
                                }
                            ],
                            series: series3
                        });

                    },
                    error: function (data) {
                        console.log('fail');
                    }
                })
            },
            drawCharts() {
                this.drawBubbleChart();
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
