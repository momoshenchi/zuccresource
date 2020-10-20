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

  const wxContext = cloud.getWXContext()
    if (event.getSelf == true) {
    //获取当前用户信息
    try {
     return await usersTable.where({
      openid: wxContext.OPENID
    }).get()
    } 
    catch (e) {
     console.error(e)
    }
   } 
   else if (event.setSelf == true) {
    //添加当前用户信息
    try {
     return await usersTable.add({
      data: {
       openid: wxContext.OPENID,
       userData: event.userData,
       downloadList: [],
       collectList:[]
      }
     })
    } 
    catch (e) {
     console.error(e)
    }
   } 
   else if (event.getOthers == true) {
    //获取指定用户信息
    try {
     return await usersTable.doc(event.userId).field({
      userData: true
     }).get()
    } catch (e) {
     console.error(e)
    }
   }
  }
