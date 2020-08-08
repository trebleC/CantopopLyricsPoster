
```
##### searchBox/index.wxss
```
.tit_seabox{
  width: calc( 100% - 64rpx );
  background: #fff;
  height: 60rpx;
  padding:20rpx 32rpx;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.tit_seabox_bar{
    width: calc( 100% - 32rpx );
    height: 60rpx;
    display: flex;
    align-items: center;
    border-radius: 30rpx;
    background: #F5F5F5;
    padding-left: 32rpx;
}
/*有权限添加活动*/
.tit_seabox_bar.tit_seabox_add{
  width:calc( 100% - 122rpx );
}
/*开始搜索时*/
.tit_seabox_bar.tit_start_search{
  width: calc( 100% - 102rpx );
}
/*开始搜索且有权限添加*/
.tit_seabox_bar.tit_start_search.tit_seabox_add{
width:calc( 100% - 192rpx );
}
.tit_seabox_bar icon{
  margin-right: 20rpx;

}
.tit_seabox input{
  height:60rpx;
  line-height:60rpx;
  font-size:28rpx;
  width:100%;
  margin-right:32rpx;

}
.activity_add{
  width:60rpx;
  text-align:right;
  border-left:4rpx solid #f2f2f2;
  margin-left:20rpx;

}
.activity_add image{
  width: 40rpx;
  height: 40rpx;
}
.activity_seabtn{
  font-size: 28rpx;
  width: 70rpx;
  text-align: right;
}

```
##### activity_list/index.wxml
```
<!-- 搜索框 -->
<view >
    <SearchBar id="SearchBar" addflag="{{addflag}}" addimg="{{addimg}}" bind:addhandle="addhandle" searchstr="{{searchstr}}" bind:searchList="searchList" bind:endsearchList="endsearchList" bind:cancelsearch="cancelsearch" bind:activity_clear="activity_clear">
    </SearchBar>
</view>
```
##### activity_list/index.js
```
Page({
  data: {
    addflag:true,  //判断是否显示搜索框右侧部分
    addimg:'../../images/activity_add.png',
    searchstr:'',
  },
  onLoad(){

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
    this.setData({
      searchstr: e.detail.value
    })
  },
  //搜索回调
  endsearchList(e) {
    console.log('查询数据')
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


})
```
##### activity_list/index.json
```
{
  "usingComponents": {
    "SearchBar": "/components/searchBox/index"
  },
  "navigationBarTitleText": "活动管理"
}
```

