import config from "../../util/config"
Page({
  data: {
    addflag:true,  //判断是否显示搜索框右侧部分
    addimg:'../../images/activity_add.png',
    searchstr:'',
    searchBar:true,

    inputShowed: false,
    inputVal: "",
    icon_check:['../../images/check.png','../../images/uncheck.png'],
    hasSelect:'../../images/check.png',
    noSelect:'../../images/uncheck.png',
        
 oLRC :{
  ti: "", //歌曲名
  ar: "", //演唱者
  al: "", //专辑名
  by: "", //歌词制作人
  offset: 0, //时间补偿值，单位毫秒，用于调整歌词整体位置
  ms: [] //歌词数组{t:时间,c:歌词}
},
  },
  onLoad(){
    this.setData({
      search: this.search.bind(this)
  })

  },
  onShow(){
   
  },

  tap(e) {

  },
 
  // 搜索框右侧 事件
  addhandle() {
    console.log('触发搜索框右侧事件')
  },

  //搜索框输入时触发
  searchList(ev) {
    let e = ev.detail;
    console.log(e.detail.value,'模糊查询字段')
    this.setData({
      searchstr: e.detail.value
    })
  },
  //搜索回调
  endsearchList(e) {
    console.log('搜索框回调函数')
  },
  // 取消搜索
  cancelsearch() {
    this.setData({
      searchstr: ''
    })
  },
  //清空搜索框
  activity_clear(e) {

    this.setData({
      searchstr: ''
    })
  },
  search: function (value) {
    let that = this
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('输出>>>>>>>>>>>', value)
          wx.request({
  url: config.httpUrl+'getSearchByKey?key='+value, 
  data: {

  },
  header: {
    'content-type': 'application/json' // 默认值
  },
  success (res) {
    // console.log(">>>>>>>>>>>>>>>>>>这是展示dataList",res.data.response.data.song.list)
    resolve(that.dataSorting(res.data.response.data.song.list,that))
  }
})
           
        }, 100)
    })
},

showRes: function (mid){
  let that = this
    return new Promise((resolve, reject) => {

        console.log('输出>>>>>>>>>>>', mid)
        wx.request({
  url: config.httpUrl+'getLyric?songmid='+mid, 
  data: {

  },
  header: {
  'content-type': 'application/json' // 默认值
  },
  success (res) {
    // console.log(">>>>>>>>>>>>>>>>>>这是展示歌曲",typeof(res.data.response.lyric),res.data.response.lyric)
     that.createLrcObj(res.data.response.lyric);
    console.log(">>>>>>>>list",that.data.oLRC)
    that.setData({
      oLRC:that.data.oLRC
    })
    resolve()
  }
  })
  })
},
selectResult: function (e) {
    console.log('select result', e.detail.item.mid)
    this.showRes(e.detail.item.mid)
    this.setData({
      searchBar:false
    })
},

dataSorting: function (data,ctx){
  let dataList = []
  data.map(function(value,index){
    //console.log(">>>>>>>>>>>>>>>>>>这是展示dataList",value.name,index)
    let list = {}
    list.text = ctx.handleNameLen(value.name,12)
    list.value = index
    list.name =  value.name
    list.mid = value.mid
    list.url =  value.url
    dataList.push(list)
    　　
     
    })

    //console.log(">>>>>>>>>>>>>>>>>>这是展示dataList",dataList)

    return dataList
},

handleNameLen:function(playerName, len){
  var new_playerName = "";
  if (playerName.length > len) {
      new_playerName = playerName.substring(0, len);
      new_playerName += "..."
  }
  else {
      new_playerName = playerName;
  }
  return new_playerName;
},

createLrcObj:function(lrc){
if(lrc.length==0) return;
  var lrcs = lrc.split('\n');//用回车拆分成数组
  for(var i in lrcs) {//遍历歌词数组
    lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
      var t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]"));//取[]间的内容
      var s = t.split(":");//分离:前后文字
      if(isNaN(parseInt(s[0]))) { //不是数值
          for (var i in this.data.oLRC) {
              if (i != "ms" && i == s[0].toLowerCase()) {
                  this.data.oLRC[i] = s[1];
              }
          }
      }else { //是数值
          var arr = lrcs[i].match(/\[(\d+:.+?)\]/g);//提取时间字段，可能有多个
          var start = 0;
          for(var k in arr){
              start += arr[k].length; //计算歌词位置
          }
          var content = lrcs[i].substring(start);//获取歌词内容
          for (var k in arr){
              var t = arr[k].substring(1, arr[k].length-1);//取[]间的内容
              var s = t.split(":");//分离:前后文字
              if(content){
              this.data.oLRC.ms.push({//对象{t:时间,c:歌词}加入ms数组
                  t: (parseFloat(s[0])*60+parseFloat(s[1])).toFixed(3),
                  c: content,
                  sureid:false
              });}
          }
      }
  }
  this.data.oLRC.ms.sort(function (a, b) {//按时间顺序排序
      return a.t-b.t;
  });
  
  for(var i in this.data.oLRC){ //查看解析结果
      console.log(i,":",this.data.oLRC[i]);
  }
},

onSelect:function(e){
  let index = e.currentTarget.dataset.selectindex;  //当前点击元素的自定义数据，这个很关键
  let oLRC = this.data.oLRC.ms;    //取到data里的selectIndex
  oLRC[index].sureid = !oLRC[index].sureid;   //点击就赋相反的值
  this.setData({
    selectIndex: oLRC   //将已改变属性的json数组更新
  })
  console.log(this.getCheck(oLRC))
},

getCheck:function(data){
  let res = []
  for (let i in data) {
    if(data[i].sureid){
      res.push(data[i].c)
    }
  }
  return res
},

onEnterSelect:function(){
  console.log("<>>>>>",this.getCheck(this.data.oLRC.ms))
}

})