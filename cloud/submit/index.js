// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: "appyunappyun-5g9b6heh81f6fadf",
  traceUser: true
})
const db = cloud.database()
const usersTable = db.collection("talk")
const _ = db.command
var today = new Date().toLocaleDateString()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await usersTable.add({
     data: {
      openid: wxContext.OPENID,
      content: event.txt,
      commentNumber: 0,
      photo:event.photo,
      writername:event.username,
      time:today,
      title:event.title
     }
    })
   } 
   catch (e) {
    console.error(e)
   }
 
}