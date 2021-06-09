<template>
  <div>
    <upload-excel :on-success="success" />
  </div>
</template>

<script>
import { importEmployee } from "@/api/employees"
export default {
  "methods": {
    async success({ header, results }) {
      // debugger
      // header results 中的数据是中文
      // 新增员工的属性是一致的
      //   username: "", 姓名
      // mobile: "",手机号
      // formOfEmployment: "",
      // workNumber: "", 工号
      // departmentName: "", 部门
      // timeOfEntry: "", 入职时间
      // correctionTime: "", 转正日期

      const userRelations = {
        "入职日期": "timeOfEntry",
        "手机号": "mobile",
        "姓名": "username",
        "转正日期": "correctionTime",
        "工号": "workNumber"
      }
      console.log(results)
      var newArr = results.map(item => {
        var userInfo = {}
        Object.keys(item).forEach(key => {
          if (
            userRelations[key] === "timeOfEntry" ||
            userRelations[key] === "correctionTime"
          ) {
            userInfo[userRelations[key]] = new Date(
              this.formatDate(item[key], "/")
            )
          } else {
            userInfo[userRelations[key]] = item[key]
          }
        })
        return userInfo
      })
      await importEmployee(newArr)
      this.$message.success("导入excel数据成功")
      this.$router.back()
    },
    // 转化excel的日期格式
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ""
      const month = time.getMonth() + 1 + ""
      const date = time.getDate() - 1 + ""
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return (
        year +
        (month < 10 ? "0" + month : month) +
        (date < 10 ? "0" + date : date)
      )
    }
  }
}
</script>

<style></style>
