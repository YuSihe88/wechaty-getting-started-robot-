#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/**
 * Wechaty - Conversational RPA SDK for Chatbot Makers.
 *  - https://github.com/wechaty/wechaty
 */

 import {
  Contact,
  Message,
  ScanStatus,
  Wechaty,
  log,
  Room,
  // UrlLink,
}                  from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'
import { FileBox }  from 'file-box'
// https://stackoverflow.com/a/42817956/1123955
// https://github.com/motdotla/dotenv/issues/89#issuecomment-587753552
import 'dotenv/config.js'
import { MessageType} from 'wechaty-puppet'
//import {  UrlLinkPayload } from 'wechaty-puppet'

const bot = new Wechaty({
  name: 'ding-dong-bot',
  
})

function onLogout (user: Contact) {
  log.info('StarterBot', '%s logout', user)
}

function onScan (qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')
    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

    qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

function onLogin (user: Contact) {
  log.info('StarterBot', '%s login', user)
}


//只改这个函数，
//async function 声明定义了一个异步函数，它
//返回一个AsyncFunction对象。
//异步函数 是指通过 事件循环（event loop） 
//异步执行的函数，通过返回一个隐式的 Promise 作为其结果。
//使用异步函数的代码的语法和结构更像使用标准同步功能。
//
async function onMessage (msg: Message) {
  log.info('StarterBot', msg.toString())
//异步函数可以包含await表达式，该表达式暂停异步函数的执行 
//并等待 Promise的执行结果返回，结果返回后就恢复异步函数的执行。
if(msg){

  if (msg.text() === 'hello') {
    await msg.say('您好！欢迎使用实习生入职向导\n机器人笛笛为您服务～\n请问有什么可以帮到您吗？\n1，若想看我回个“dong!“，请回复“ding”\n2，若想了解企业福利，请回复“企业福利”\n3，若想了解我们的公司业务，请回复：“公司业务”\n4，若想了解我们的企业文化，请回复：“企业文化”\n5若想询问其他事项请联系我们的人力小哥，请回复：“更多信息”\n')

  }

  //附加功能一：查看这条消息是否为机器人发送的。（成功运行）
  if (msg.self()) {
    console.log('this message is sent by myself!')
  }
   
  //附加功能二：获取机器人是否在群里被@ 了。（成功运行）
   if (await msg.mentionSelf()) {
    console.log('this message were mentioned me! [You were mentioned] tip ([有人@我]的提示)')
   }

   //附加功能三：获取消息所在的微信群，如果这条消息不在微信群中，会返回null
  const contact = msg.from() as Contact
  //const text = msg.text()
  const room = msg.room()
  
  /*if (room) {
    const topic = await room.topic()
    console.log(`Room: ${topic} Contact: ${contact?.name()} Text: ${text}`)
    return
  } else {
    console.log(`Contact: ${contact?.name()} Text: ${text}`)
  }*/

  //附加功能四：获取撤回消息的文本内容。
  //有点小问题用的快速解决->从库里直接调用的MessageType，不知道能不能成功运行（已成功）
  if (msg.type() === MessageType.Recalled) {
    const recalledMessage = await msg.toRecalled()
    console.log(`Message: ${recalledMessage} has been recalled.`)
  }

  //功能一：发送消息ding返回消息dong（text）✅
  if (msg.text() === 'ding') {
    await msg.say('dong!!')
  }

  //功能二：发送消息“企业福利”返回消息（text）✅
  if (msg.text() === '企业福利'){
    await contact.say('面试通过后你将有可能参与如下工作：\n1、与全球最大的聊天机器人开源框架团队一起打造中国互联网新的营销生态；\n2、以“上帝视角”观察分析国内一线消费品品牌、TOP级网红、全球头部美妆品牌的市场营销策略，并形成群体智慧；\n3、参与句子互动市场宣传工作，见证句子从市值千万美元到过亿的增长过程。')
    await msg.say('在句子你将获得如下回报：\n1、成为掌握并可落地实践当前互联网最领先的市场营销玩法——私域运营的少数人之一；\n2、掌握一套标准化、可复制的商业分析文档撰写方法论；\n3、切身体验欧莱雅、元气森林、薇娅等顶级流量团队的运营实践；\n4、人均95后、日均收入200元、有午餐、具备转正培养计划的神仙实习经历。')
  }

  // 功能三：发送消息“公司业务”返回消息（图片）✅

  if (msg.text() === '公司业务'){
    const fileBox1 = FileBox.fromUrl('https://img-blog.csdnimg.cn/239f58a86fa54a22a25f156e8ce102ec.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5L2Z5oCd6I23,size_20,color_FFFFFF,t_70,g_se,x_16')
    await contact.say(fileBox1)
  }

  // 功能四：发送消息“企业文化”返回消息（链接）✅

  if (msg.text() === '企业文化') {
    console.info('企业文化')
    const link = await bot.UrlLink.create('https://k0auuqcihb.feishu.cn/docs/doccn18HZBOz5OI3Jwixeusll0f')
    await msg.say(link)
  }

/*if (msg.text() === '句子互动') {
  const payload: UrlLinkPayload = {
    description : 'this is url link description',
    thumbnailUrl: 'https://pic1.zhimg.com/80/v2-43a082acb9c98dc435bf7d270dd6d257_1440w.jpg?source=c8b7c179',
    title       : 'this is title',
    url         : 'https://mp.weixin.qq.com/s/u0Ugmy2NANUXurMMbOlUzw',
  }
  const urlLink = new UrlLink (payload)
  await contact.say(urlLink)
}*/


  // 功能五：发送消息“更多信息”返回消息（名片）✅
  if (msg.text() === '更多信息'){
    const contactCard = await bot.Contact.find({name: '余思荷'}) 
    if(!contactCard) throw new Error('')
    await msg.say(contactCard as Contact)
}
  
  //进入群聊部分！！！！
  //当有人在群里@机器人时，调用onroom函数(群聊部分)✅
  if (room && msg.mentionSelf()){

    console.log("onRoom()") 
    var m = onRoom(msg, room)
    console.log(m) 
  } 

  }}

  async function onRoom (msg: Message, room: Room) {
    log.info('StarterBot', room.toString())
    //console.log("onRoom()") 
    await room.sync()

//导语
 if(room){
  
    if (await msg.mentionSelf()) {

      await room.say('您好！欢迎使用实习生入职向导\n机器人笛笛为您服务～\n请问有什么可以帮到您吗？\n1，若想看我回个“dong!“，请回复“ding”\n2，若想了解我们的企业福利，请回复“2”\n3，若想了解我们的公司业务，请回复：“3”\n4，若想了解我们的企业文化，请回复：“4”\n5，若想询问其他事项请联系我们的人力小哥，请回复：“5”\n')
      // 功能六： 将文本发入群中并@所有人（每边都发）
      //if (msg.text() === '嗯') {
      //console.info('嗯') 
      const members = await room.memberAll() // memtion all members in this room
      const someMembers = members.slice(0, 3);
      await room.say('又有新同学加入啦！欢迎欢迎！😄', ...someMembers)
    //}
    }
  
   //功能一：发送消息ding返回消息dong（text）（发两遍啊）
    /*if (msg.text() === 'ding') {
      if (msg.self()) {
        console.log('this message is sent by myself!')
        return ;
      }
      else{
        await msg.say('dong!!')
      }
      
    }*/
  
    //功能二：发送消息“ 2 ”返回消息（text）✅
    if (msg.text() === '2'){
      if (msg.self()) {
        console.log('this message is sent by myself!')
        return ;
      }
      else{
        //console.info('企业福利')
        await msg.say('在句子你将获得如下回报：\n1、成为掌握并可落地实践当前互联网最领先的市场营销玩法——私域运营的少数人之一；\n2、掌握一套标准化、可复制的商业分析文档撰写方法论；\n3、切身体验欧莱雅、元气森林、薇娅等顶级流量团队的运营实践；\n4、人均95后、日均收入200元、有午餐、具备转正培养计划的神仙实习经历。')
      
      }
    }
  
    // 功能三：发送消息“ 3 ”返回消息（图片）（私聊群聊都发）
  
    if (msg.text() === '3'){
      if (msg.self()) {
        console.log('this message is sent by myself!')
        return ;
      }
      else{
        //console.info('公司业务')
        const fileBox = FileBox.fromUrl('https://img-blog.csdnimg.cn/239f58a86fa54a22a25f156e8ce102ec.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5L2Z5oCd6I23,size_20,color_FFFFFF,t_70,g_se,x_16')
        await msg.say(fileBox)
      }
     
    }
  
    // 功能四：发送消息“ 4 ”返回消息（链接）✅
  
    if (msg.text() === '4') {
      if (msg.self()) {
        console.log('this message is sent by myself!')
        return ;
      }
      else{
      //console.info('企业文化')
      const link = await bot.UrlLink.create('https://k0auuqcihb.feishu.cn/docs/doccn18HZBOz5OI3Jwixeusll0f')
      await msg.say(link)
    }
      }
      
  
    // 功能五：发送消息“ 5 ”返回消息（名片）✅
    if (msg.text() === '5') {
      if (msg.self()) {
        console.log('this message is sent by myself!')
        return ;
      }
      else {
          const contactCard = await bot.Contact.find({name: '余思荷'}) 
          if(!contactCard) throw new Error('')
          await msg.say(contactCard as Contact)
    }
    }
  
  /*async (roomInvitation: { accept: () => any }) => {
    try {
      console.log(`received room-invite event.`)
      await roomInvitation.accept()
    } catch (e) {
      console.error(e)
    }*/
  

 }

}
  

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)
//bot.on('room',    onRoom)

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(e => log.error('StarterBot', e))
  
