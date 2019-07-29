import re
import os
import xlrd
import json
import codecs
import pandas as pd
from datetime import datetime
from xlrd import xldate_as_tuple


# xlrd 会将 excel 中单元格的日期读为 float 数值，需要重新转换为 datetime
def float_to_datetime(float_time):
    return datetime(*xldate_as_tuple(float_time.value, 0))


# 利用 pandas 将 csv 格式转为 xlsx 格式
def csv_to_xlsx(csv_file_name):
    csv_file = pd.read_csv(open(csv_file_name), encoding='utf-8')

    # 命名转换后的 excel 文件名：用正则表达式获取“郑州银行数据/BPC.csv”中的“郑州银行数据/BPC”
    excel_file_name = re.findall(r"(.+?).csv", csv_file_name)[0] + '.xlsx'

    csv_file.to_excel(excel_file_name, sheet_name='data')


def excel_to_json(excel_file_name):
    # 读取 excel 文件
    workbook = xlrd.open_workbook(excel_file_name)

    # 获取 excel 中的第一个表单
    sheet = workbook.sheet_by_index(0)

    # 用 write_data 来存储转换后的 json 格式内容
    write_data = "{"

    # 如果是 Tivoli 报表
    if 'Tivoli' in excel_file_name:
        # 前两行需要单独处理，因为是合并后的单元格
        write_data += '\n\t"报表名": "' + str(sheet.cell(0, 0).value) + '",'
        write_data += '\n\t"' + str(sheet.cell(1, 0).value) + '": "' + str(
            float_to_datetime(sheet.cell(1, 6))) + '",'

        begin_row = 2  # 起始行在第三行
        begin_col = 0
    # 如果是 BPC 报表
    else:
        begin_row = 0
        begin_col = 1  # 利用 pandas 转换得到的 xlsx 格式文件，会多出第一列来表示行号，需要从第二列开始

    # 按列循环读取单元格的内容 sheet.cell(row, col).value，存入 write_data 字符串中
    for col in range(begin_col, sheet.ncols):
        for row in range(begin_row, sheet.nrows):
            if row == begin_row:
                write_data += '\n\t"' + str(sheet.cell(row, col).value) + '": '
            else:
                if row == begin_row + 1:
                    write_data += '['
                # 如果单元格的内容是 float 类型，则说明原内容为 datatime 日期类型，进行转换
                if type(sheet.cell(row, col)) == float:
                    write_data += '"' + str(float_to_datetime(sheet.cell(row, col)).value) + '"'
                else:
                    # 将单元格内容中带 '\' 的字符串转换为 '\\'，否则 json 格式内容出错
                    unsolved_str = str(sheet.cell(row, col).value)
                    solved_str = unsolved_str.replace('\\', '\\\\')

                    # 将 BPC 表中单元格内容中的“SPV=？: 组件=？: 交易渠道=？”过滤，只保留“组件”的内容
                    if "组件" in solved_str:
                        solved_str = re.findall(r".+?组件=(.+?)$", solved_str)[0]
                        if ':' in solved_str:
                            solved_str = re.findall(r"(.+?) :.+?", solved_str)[0]

                    write_data += '"' + solved_str + '"'
                if row < sheet.nrows - 1:
                    write_data += ', '
            if row == sheet.nrows - 1:
                write_data += ']'
        if col < sheet.ncols - 1:
            write_data += ','
        else:
            write_data += '\n}'
    return write_data


if __name__ == '__main__':
    # 将 xlsx 转换为 json 格式的字符串
    tivoli_json_str = excel_to_json('郑州银行数据/Tivoli数据.xlsx')
    print(tivoli_json_str)
    # json 格式字符串转换为字典格式
    json_dict = json.loads(tivoli_json_str)
    # 将字典格式的数据写入 *.json 文件
    with codecs.open("Tivoli.json", "w", 'utf-8') as outfile:
        json.dump(json_dict, outfile, ensure_ascii=False)

    # 将 BPC.csv 文件转换为 BPC.xlsx 文件
    if not os.path.exists('郑州银行数据/BPC.xlsx'):
        csv_to_xlsx('郑州银行数据/BPC.csv')

    # 将 xlsx 转换为 json 格式的字符串
    bpc_json_str = excel_to_json('郑州银行数据/BPC.xlsx')
    print(bpc_json_str)
    # json 格式字符串转换为字典格式
    json_dict = json.loads(bpc_json_str)
    # 将字典格式的数据写入 *.json 文件
    with codecs.open("BPC.json", "w", 'utf-8') as outfile:
        json.dump(json_dict, outfile, ensure_ascii=False)
