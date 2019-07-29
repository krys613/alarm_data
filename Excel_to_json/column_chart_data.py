import json


def column_chart_bpc_tivoli(table_name):
    # json_file_name 为需要提取数据的表的 json 文件
    # x_label_name 为横坐标数据的名称：如'PMTS网银互联往账', '网银互联应用新'等组件
    # each_x_label_name 为横坐标中每个点的不同条状所代表含义的名称：如'成功率低于阈值', '响应率低于阈值'
    if table_name == 'bpc':
        json_file_name = 'BPC.json'
        x_label_name = '数据来源'
        each_x_label_name = '事件'
    else:
        json_file_name = 'Tivoli.json'
        x_label_name = '所属业务系统'
        each_x_label_name = '原始级别'

    # 读取 json 文件到 json_data_dict 字典中
    json_data_dict = {}
    with open(json_file_name, "r", encoding="utf-8") as json_file:
        json_data_dict = json.load(json_file)

    # component_list 表示横坐标的所有值，即 x_label_name 的列表
    # event_list 表示横坐标中每个点的不同条状所代表含义的所有名称，即each_x_label_name 的列表
    component_list = []
    event_list = []

    # 直接运行看结果比较明显
    component_event_dict = {}
    for i in range(len(json_data_dict[x_label_name])):
        new_dict = {}

        key = json_data_dict[x_label_name][i]
        if key not in component_list:
            component_list.append(key)

        for j in range(len(json_data_dict[each_x_label_name])):
            if json_data_dict[x_label_name][j] != key:
                continue
            sub_key = json_data_dict[each_x_label_name][j]
            if sub_key not in event_list:
                event_list.append(sub_key)
            if sub_key not in new_dict:
                new_dict[sub_key] = 1
            else:
                new_dict[sub_key] += 1
        component_event_dict[key] = new_dict

    # 打印结果
    print(component_event_dict)
    print(x_label_name, ': ', component_list)
    print(each_x_label_name, ': ', event_list)

    for i in range(len(event_list)):
        new_list = []
        for j in range(len(component_event_dict.keys())):
            key = list(component_event_dict.keys())[j]
            if event_list[i] not in list(component_event_dict[key].keys()):
                new_list.append(0)
            else:
                new_list.append(component_event_dict[key][event_list[i]])
        print(event_list[i] + ': ', new_list)


if __name__ == '__main__':
    column_chart_bpc_tivoli('bpc')
    print('\n')
    column_chart_bpc_tivoli('tivoli')
