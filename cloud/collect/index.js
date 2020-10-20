// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: "appyunappyun-5g9b6heh81f6fadf",
  traceUser: true
})
const db = cloud.database()
const usersTable = db.collection("user")
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await usersTable.where({
      "_id":event.userid
    }).update({
     data: {
      collectList: _.push(event.id)
     }
    })
   } catch (e) {
    console.error(e)
   }

}