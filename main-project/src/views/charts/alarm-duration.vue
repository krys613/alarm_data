<template>
    <section class="chart-container">
        <el-row>
            <el-col :span="12">
                <div id="myChart" style="width:1500px; height:1800px;display: none"></div>
            </el-col>
            <el-col :span="22">
                <div id="myCharts" style="width:1500px; height:2200px;display: none"></div>
            </el-col>
            <el-col :span="12">
                <div id="myNew" style="width:1500px; height:2400px;"></div>
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
                myChart: null,
                myCharts: null,
                myNew:null


            }
        },

        methods: {
            drawMyChart() {
                $.ajax({
                    type: 'get',
                    dataType: 'jsonp',
                    url: 'http://10.82.82.15/aiops/BPC/getAlarmTime',
                    jsonp: "callback",
                    success: function (dat) {
                        var dataTest = JSON.parse(JSON.stringify(dat));

                        function hours(datas) {
                            var hours = [];
                            for (var i = 0; i < datas.length; i++) {
                                var arr = datas[i].triggerTimeList;
                                hours = hours.concat(arr);
                                var shour = new Set(hours);
                                hours = Array.from(shour);
                            }
                            hours.sort();
                            return hours;
                        }

                        function days(datas) {
                            var days = [];
                            for (var i = 0; i < datas.length; i++) {
                                var arr = datas[i].name;
                                days = days.concat(arr);
                            }
                            return days;
                        }

                        function data(datas) {
                            
                            var dataitem = [];
                            for (var i = 0; i < datas.length; i++) {
                                
                                for (var j = 0; j < datas[i].triggerTimeList.length; j++) {
                                    var arr = [];
                                    arr[0] = datas.indexOf(datas[i]);
                                    arr[1] = datas[i].triggerTimeList[j];
                                    arr[2] = datas[i].durationList[j];
                                    //console.log(arr);
                                    dataitem.push(arr);
                                    
                                }
                            }
                            //console.log(dataitem);
                            return dataitem;
                        }

                        var hours = hours(dataTest);
                        //hours = hours.map(function (str) {
                        // return str.replace('2018/', '');
                        //});
                        var days = days(dataTest);
                        var data = data(dataTest);
                        var num = dataTest.length;
                        // console.log(num);
                        this.myChart = echarts.init(document.getElementById('myChart'));
                        var titles = [];
                        var singleAxises = [];
                        var serieses = [];
                        var dataZooms=[];
                        echarts.util.each(days, function (day, idx) {
                            titles.push({
                                textBaseline: 'middle',
                                top: (idx + 1.6) * 95 / num + '%',
                                text: day.split("=").join("\n=").split("（网联）").join("\n(网联)"),
                                textStyle: {
                                    fontSize: 16
                                }
                            });
                            singleAxises.push({
                                left: 240,
                                type: 'category',
                                boundaryGap: false,
                                data: hours,
                                top: (idx * 95 / num + 1) + '%',
                                height: (95 / num ) + '%',
                                width:80+'%',

                            });

                            dataZooms.push({
                                type:'slider',
                                show:true,
                                singleAxisIndex: idx,
                                boundaryGap: false,
                                top: (idx * 95 / num + 4) + '%',
                                height: (95 / num )*0.3 + '%',
                                //left: '10.4%',
                                bottom: -5,
                                start: 10,
                                end: 90
                            });

                            serieses.push({
                                singleAxisIndex: idx,
                                coordinateSystem: 'singleAxis',
                                type: 'scatter',
                                data: [],
                                name:day,
                                symbolSize: function (dataItem) {
                                    var i=dataItem[1]*5;
                                    var j=Math.log(i);
                                    return j*8.8;
                                    //return dataItem[1]*5;
                                }
                            });
                        });

                        echarts.util.each(data, function (dataItem) {
                            serieses[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
                        });
                        this.myChart.setOption({
                            tooltip: {
                                position: 'top'
                            },
                            legend:{
                                type: 'scroll',
                                orient: 'vertical',
                                right:-200,
                                top: 100,
                                bottom:"auto",
                                width:"auto",
                                height:"auto",
                                data: days,
                                selected:{
                                    //"AFE(内联)":false,
                                    "AFE(柜面等)":false,
                                    "ATMP":false,
                                    "CUPP来账":false,
                                    "ECIF":false,
                                    "ITGS":false,
                                    "IVS":false,
                                    "MIS":false,
                                    "PMTS网银互联往账":false,
                                    "PMTS网银互联来账":false,
                                    "SEAI":false,
                                    "SEAI(银联)":false,
                                    "SEAI(银联来账)":false,
                                    "VTMS":false,
                                    "WCBK微信APP":false,
                                    "WMS":false,
                                    "二代支付应用":false,
                                    "企业手机银行应用":false,
                                    "手机银行APP":false,
                                    "手机银行WEB":false,
                                    "灾备CBV7":false,
                                    "灾备ESB : 交易渠道=网络支付清算平台（网联）(EPCC)":false,
                                    "生产ESB : 交易渠道=统一收单系统(UERS)":false,
                                    "生产ESB : 交易渠道=网络支付清算平台（网联）(EPCC)":false,
                                    "生产NFTS":false,
                                    "网银互联应用新":false,
                                    "网银互联来账":false,
                                    "银企应用":false,
                                    "银企接入":false,
                                    "银联往帐":false,
                                    "银银平台":false,
                                },


                            },
                            title: titles,
                            singleAxis: singleAxises,
                            dataZoom:dataZooms,
                            series: serieses
                        });
                    },
                    error: function (dat) {
                        console.log('fail');
                    }
                })
            },

            drawMyCharts() {
                $.ajax({
                        type: 'get',
                        dataType: 'jsonp',
                        url: 'http://10.82.82.15/aiops/Tivoli/getAlarmTime',
                        jsonp: "callback",
                        success: function (dat) {
                            var dataTest = JSON.parse(JSON.stringify(dat));

                            function hours(datas) {
                                var hours = [];
                                for (var i = 0; i < datas.length; i++) {
                                    var arr = datas[i].triggerTimeList;
                                    hours = hours.concat(arr);
                                    var shour = new Set(hours);
                                    hours = Array.from(shour);
                                }
                                hours.sort();
                                return hours;

                            }

                            function days(datas) {
                                var days = [];
                                for (var i = 0; i < datas.length; i++) {
                                    var arr = datas[i].name;
                                    days = days.concat(arr);

                                }
                                return days;

                            }

                            function data(datas) {
                               
                                var dataitem = [];
                                for (var i = 0; i < datas.length; i++) {
                                    
                                    for (var j = 0; j < datas[i].triggerTimeList.length; j++) {
                                        var arr = [];
					                    arr[0] = datas.indexOf(datas[i]);
                                        arr[1] = datas[i].triggerTimeList[j];
                                        arr[2] = datas[i].durationList[j];
                                        //console.log(arr);
                                        dataitem.push(arr);
                                        
                                    }
                                }
                                //console.log(dataitem);
                                return dataitem;
                            }

                            var hours = hours(dataTest);
                            //hours = hours.map(function (str) {
                            //return str.replace('2018/', '');
                            //});
                            var days = days(dataTest);
                            var data = data(dataTest);
                            var num = dataTest.length;
                            //console.log(num);
                            this.myCharts = echarts.init(document.getElementById('myCharts'));
                            var titles = [];
                            var singleAxises = [];
                            var serieses = [];
                            var dataZooms=[];
                            echarts.util.each(days, function (day, idx) {
                                titles.push({
                                    textBaseline: 'middle',
                                    top: (idx + 1.4) * 95 / num + '%',
                                    text: day,
                                    textStyle: {
                                        fontSize: 16
                                    }
                                });
                                singleAxises.push({
                                    left: 240,
                                    type: 'category',
                                    boundaryGap: false,
                                    data: hours,
                                    top: (idx * 95 / num + 1) + '%',
                                    height: (95 / num ) + '%',
                                    width:80+'%',

                                });

                                dataZooms.push({
                                    type:'slider',
                                    show:true,
                                    singleAxisIndex: idx,
                                    boundaryGap: false,
                                    top: (idx * 95 / num + 3.5) + '%',
                                    height: (95 / num )*0.3 + '%',
                                    //left: '9%',
                                    bottom: -5,
                                    start: 10,
                                    end: 90


                                });
                                serieses.push({
                                    singleAxisIndex: idx,
                                    coordinateSystem: 'singleAxis',
                                    type: 'scatter',
                                    data: [],
                                    name:day,
                                    symbolSize: function (dataItem) {
                                        var i=dataItem[1] * 5;
                                        var j=Math.log(i);
                                        return j*8.8;
                                        //return dataItem[1] * 7;
                                    }

                                });
                            });
                            echarts.util.each(data, function (dataItem) {
                                serieses[dataItem[0]].data.push([dataItem[1], dataItem[2]]);

                            });
                            this.myCharts.setOption({
                                tooltip: {
                                    position: 'top'
                                },
                                legend:{
                                    type: 'scroll',
                                    orient: 'vertical',
                                    right:-20,
                                    top: 200,
                                    bottom:"auto",
                                    width:"auto",
                                    height:"auto",
                                    data: days,
                                    selected:{

                                        // "ACS系统":false,
                                        "CBV7":false,
                                        "COMSTAR系统":false,
                                        "CRM":false,
                                        "EAST3.0系统":false,
                                        "GTP归档":false,
                                        "Tivoli监控":false,
                                        "个人手机银行":false,
                                        "事后监督":false,
                                        "信用卡管理":false,
                                        "信贷业务风险管理系统":false,
                                        "内审系统":false,
                                        "加密平台":false,
                                        "历史库查询":false,
                                        "国库集中支付":false,
                                        "大总账系统":false,
                                        "客户服务系统":false,
                                        "指纹系统":false,
                                        "数据仓库":false,
                                        "无":false,
                                        "智能排队管理系统":false,
                                        "现代化支付":false,
                                        "理财销售系统":false,
                                        "电商管理":false,
                                        "监管报送":false,
                                        "票据系统":false,
                                        "统一备份":false,
                                        "统一授信管理系统":false,
                                        "绩效考核":false,
                                        "网银互联":false,
                                        "网银系统灾备":false,
                                        "资产负债管理系统":false,
                                        "资金转移定价":false,
                                        "身份核查":false,
                                        "银企对账":false,
                                        "银企平台":false,
                                        "长亮新前置":false,
                                        "长亮老前置系统":false,
                                        "验印系统":false,
                                    },

                                },

                                title: titles,
                                singleAxis: singleAxises,
                                dataZoom:dataZooms,
                                series: serieses

                            });
                        },
                        error: function (dat) {
                            console.log('fail');
                        }
                    }
                )

            },
            
            drawMyNew(){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: 'http://10.82.82.15/aiops/BPC/getAlarmTime',
                    success: function (dat) {
                        var dataTest = JSON.parse(JSON.stringify(dat));
                        function hours(datas) {
                            var hours = [];
                            for (var i = 0; i < datas.length; i++) {
                                var arr = datas[i].triggerTimeList;
                                hours = hours.concat(arr);
                                var shour = new Set(hours);
                                hours = Array.from(shour);
                            }
                            hours.sort();
                            return hours;
                        }

                        function days(datas) {
                            var days = [];
                            for (var i = 0; i < datas.length; i++) {
                                var arr = datas[i].name;
                                days = days.concat(arr);
                            }
                            return days;
                        }

                        function data(datas) {

                            var dataitem = [];
                            for (var i = 0; i < datas.length; i++) {
                                for (var j = 0; j < datas[i].triggerTimeList.length; j++) {
                                    var arr = [];
                                    arr[0] = datas.indexOf(datas[i]);
                                    arr[1] = datas[i].triggerTimeList[j];
                                    arr[2] = datas[i].durationList[j];
                                    //console.log(arr);
                                    dataitem.push(arr);

                                }
                            }
                            //console.log(dataitem);
                            return dataitem;
                        }

                        var hours = hours(dataTest);
                        var days = days(dataTest);
                        var data = data(dataTest);

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
                        data=data.map(function(item){
                            return[item[1],item[0],item[2]];
                        });
                        var categories =[];
                        for(var i=0;i<days.length;i++){
                            categories[i]={
                                name:days[i]
                            };
                        };
                        var cate = categories.map(function (a) {
                            var name = a.name;
                            var tmp = [];
                            var res;
                            if(name.length > 10){
                                while(name.length > 10){
                                    tmp.push(name.substring(0, 10));
                                    name = name.substring(10, name.length);
                                }
                                res = tmp[0];
                                for(var i = 1; i < tmp.length; i++){
                                    res = res + "\n" + tmp[i];
                                }
                            }
                            else res = name;
                            return res;
                        });
                        var cate_data = [];
                        for(var i = 0; i < cate.length; i++){
                            var tmp = [];
                            var tmp_size = [];
                            for(var j = 0; j < data.length; j++){
                                if(data[j][1] == i){
                                    tmp.push(data[j])
                                }
                            }
                            cate_data[i] = tmp;
                        }

                        var series = [];
                        for (var i = 0; i < cate_data.length; i++) {
                            series.push({
                                name: cate[i],
                                type: 'scatter',
                                symbolSize: (val, params) => {
                                    params.symbolSize = Math.log(val[2] * 5) * 8.8;
                                    return params.symbolSize;
                                },
                                data: cate_data[i],
                                animationDelay: function (idx) {
                                    return idx * 3;
                                }
                            });
                        }

                        console.log(series);

                        this.myNew = echarts.init(document.getElementById('myNew'));
                        this.myNew.setOption({
                            //title: titles,
                            legend: {
                                data: cate
                            },
                            tooltip: {
                                position: 'top'
                            },
                            xAxis:{
                                type: 'category',
                                data: hours,
                                width:80+'%',
                                boundaryGap: false,
                                splitLine: {
                                    show: true,

                                },
                                axisLine: {
                                    show: false
                                },
                            },
                            yAxis:{
                                type: 'category',
                                data: cate,
                                axisLine: {
                                    show: false
                                }
                            },
                            dataZoom:dataZoom,
                            series: series
                        });
                    },
                    error: function (dat) {
                        console.log('fail');
                    }
                })


            },

            drawCharts() {
                // this.drawMyChart();
                // this.drawMyCharts();
                this.drawMyNew();
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
        width: 1500px;
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
