$('#addCategory').on('submit', function(){
  var formData = $(this).serialize();
  $.ajax({
    type:'post',//get或post
    url:'/categories',//请求的地址
    data:formData,//如果不需要传，则注释掉 请求的参数，a=1&b=2或{a:1,b:2}或者jq中的serialize方法，或者formData收集
    success:function(result){//成功的回调函数
      console.log(result)
      location.reload();
    }
  })
  return false;
})

//发送ajax获取用户列表
$.ajax({
  type:'get',//get或post
  url:'/categories',//请求的地址
  data:{},
  success:function(result){//成功的回调函数
    console.log(result)
    var html = template('categoryListTpl',{data:result});
    $('#categoryBox').html(html);
  }
})

//当点击编辑按钮的时候，让当前一行的内容展示在左侧的表单上面
$('#categoryBox').on('click','.edit', function(){
  var id = $(this).attr('data-id');
  console.log(id);
  $.ajax({
    type:'get',//get或post
    url:'/categories/'+id,//请求的地址
    data:{},
    success:function(result){//成功的回调函数
      console.log(result)
      var html = template('modifyFormTpl',result);
      $('#formBox').html(html);
    }
  })
})

//当提交修改表单的时候 ajax
$('#formBox').on('submit', '#modifyCategory', function(){
  var formData = $(this).serialize();
  var id = $(this).attr('data-id');
  $.ajax({
    type:'put',//get或post
    url:'/categories/'+id,//请求的地址
    data:formData,
    success:function(result){//成功的回调函数
      console.log(result)
      location.reload();
    }
  })
})

//删除功能
$('#categoryBox').on('click','.delete',function(){
  if (confirm('确定删除吗')) {
    var id = $(this).attr('data-id');
    $.ajax({
      type:'delete',//get或post
      url:'/categories/'+id,//请求的地址
      data:{},
      success:function(result){//成功的回调函数
        console.log(result)
        location.reload();
      }
    })
  }
})