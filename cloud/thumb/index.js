// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: "appyunappyun-5g9b6heh81f6fadf",
  traceUser: true
})
const db = cloud.database()
const usersTable = db.collection("file_con")
const _ = db.command

// 云函数入口函数con
exports.main = async (event, context) => {
  if(event.good==true)
  {
    try {
     return await usersTable.where({
       "id":event.id
     }).update({
      data: {
       good: _.inc(1),
       goodrate:event.rate
      }
     })
    } catch (e) {
     console.error(e)
    }
  }
  else if(event.bad==true)
  {
    try {
      return await usersTable.where({
        "id":event.id
      }).update({
       data: {
        bad: _.inc(1),
        goodrate:event.rate
       }
      })
     } catch (e) {
      console.error(e)
     }
  }
}