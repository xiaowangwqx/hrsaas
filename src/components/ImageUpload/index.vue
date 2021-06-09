<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :file-list="fileList"
      :class="{ disabled: fileComputed }"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" style="width:180px" :percentage="percent" />
    <el-dialog title="图片预览" :visible.sync="showDialog">
      <img :src="imgUrl" style="width:100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
import Cos from 'cos-js-sdk-v5' // 引入腾讯云的cos包
// 实例化cos对象
const cos = new Cos({
  SecretId: 'AKIDNdgaGivtc6LL5YljQs3yd2B9vVs1uXu2', // 身份识别id
  SecretKey: 'ub3FBrKZZZMvIRM2TeaHjwudAWgbIkDR' // 身份密钥
})
export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFileUid: null, // 记录当前正在上传的图片uid
      percent: 0, // 百分比
      showPercent: false
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove(file, fileList) {
      // file是删除的文件
      // fileList是删除之后的文件
      //   console.log(file)
      //   console.log(fileList)
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      //   this.fileList = fileList
    },
    changeFile(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      //   console.log(file
      // 检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        this.$message.error('图片格式不正确')
        return false // 上传中止
      }
      //   检查大小
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('上传图片大小不能超过5M')

        return false
      }
      // 确定上传
      this.currentFileUid = file.uid
      this.showPercent = true
      return true // 最后一定要return true
    },
    // 上传操作
    upload(params) {
      if (params.file) {
        //   执行上传操作
        cos.putObject(
          {
            Bucket: 'hrsass-001-1306170131' /* 存储桶 */,
            Region: 'ap-shanghai' /* 地域 */,
            Key: params.file.name /* 文件名 */,
            StorageClass: 'STANDARD',
            Body: params.file, // 上传文件对象
            StorageClass: 'STANDARD', // 上传的模式类型 默认标准模式
            onProgress: params => {
              this.percent = params.percent * 100
            }
          },
          (err, data) => {
            console.log(err || data)
            if (!err && data.statusCode === 200) {
              // 文件上传成功
              // 获取成功的返回地址 将fileList中的url地址变成腾讯云存储桶中返回的地址
              //   如果有多张图片 要知道上传成功的是哪一张图片的
              this.fileList = this.fileList.map(item => {
                if (item.uid === this.currentFileUid) {
                  // 将成功的地址赋值给原来的url地址
                  return { url: 'http://' + data.Location, upload: true }
                  //   upload: true表示这张图片已经上传完成
                  // 保存 =>图片有大有小 => 上传速度有快有慢=>要根据有没有upload这个标记决定是否保存
                }
                return item
              })
              // 将上传成功的地址 回写到fileList中
              setTimeout(() => {
                this.showPercent = false // 隐藏进度条
                this.percent = 0 // 进度归0
              }, 2000)
            }
          }
        )
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
