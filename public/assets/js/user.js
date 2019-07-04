$('#userForm').on('submit', function(){
  //serialize 需要保证表单每一个input需要有name属性

  // console.log(formData); 
  $.ajax({
    type:'post',//get或post
    url:'/users',//请求的地址
    data:$('#userForm').serialize(),
    success:function(result){//成功的回调函数
      // console.log(result);
      location.reload();
    }
  })
  //阻止页面刷新的默认行为
  return false;
})

//用时间委托来修改，一定要委托一直存在的元素
$('#formBox').on('change','#avatar', function(){
  //ajax上传图片时必须使用formData 文件上传
  var formData = new FormData();
  formData.append('avatar',this.files[0]);

  //jQuery中$.ajax默认的contentType值是’application/x-www-form-urlencoded'
  //jQuery中$.ajax默认会把数据变成key=value&key=value的形式，我们这里不需要，因为数据是二进制的数据
  $.ajax({
    type:'post',//get或post
    url:'/upload',//请求的地址
    contentType:false,
    processData:false,
    data:formData,
    success:function(result){//成功的回调函数
      // console.log(result)
      $('#preview').attr('src', result[0].avatar);
      $('#hiddenImg').val( result[0].avatar);
    }
  })
})

//向服务器发送请求 索要用户列表数据
$.ajax({
  type:'get',//get或post
  url:'/users',//请求的地址
  success:function(result){//成功的回调函数
    console.log(result)
    var html = template('userTpl',{data: result});
    $('#usersBox').html(html);
  }
})

//修改分为2步
$('#usersBox').on('click', '.edit', function(){
  //利用事件委托 电机获取当前这个编辑按钮的id值
  //想获取一点东西，这个东西必须提前保存起来
  var id = $(this).attr('data-id');
  //通过ajax把当前这个用户信息查询出来
  $.ajax({
    type:'get',//get或post
    url:'/users/'+id,//请求的地址
    data:{},
    success:function(result){//成功的回调函数
      console.log(result)
      var html = template('modifyTpl',result);
      $('#formBox').html(html);
    }
  })
  
})


$('#formBox').on('submit','#userForm', function() {
  //收集表单数据
  var formData = $(this).serialize();
  var id = $(this).attr('data-id');
  $.ajax({
    type:'put',//get或post
    url:'/users/'+id,//请求的地址
    data:formData,
    success:function(result){//成功的回调函数
      location.reload();
    }
  })
})

//删除功能 利用事件委托
$('#usersBox').on('click','.delete', function() {
  var id = $(this).attr('data-id');
  console.log(id);
  $.ajax({
    type:'delete',//get或post
    url:'/users/'+id,//请求的地址
    success:function(result){//成功的回调函数
      location.reload();
    }
  })
})

$('#selectAll').on('change', function () {
  var bool = $(this).prop('checked');
  $('#usersBox').find('.status').prop('checked', bool);
  if (bool == true) {
    $('#deleteMany').show();
  } else {
    $('#deleteMany').hide();
  }
})

$('#usersBox').on('change','.status', function(){
  if ($('#usersBox').find('.status').length == $('#usersBox').find('.status').filter(':checked').length) {
    $('#selectAll').prop('checked',true);
  } else {
    $('#selectAll').prop('checked',false);
  }
  if ($('#usersBox').find('.status').filter(':checked').length >= 2 ) {
    $('#deleteMany').show();
  } else {
    $('#deleteMany').hide();
  }
})

$('#deleteMany').on('click', function() {
  if (confirm('确定删除吗')){
    var selectAll = $('#usersBox').find('.status').filter(':checked');
    var arr = [];
    selectAll.each(function(index, element) {
      console.log($(element).attr(data-id))
      arr.push($(element).attr('data-id'));
    })
    $.ajax({
      type:'delete',//get或post
      url:'/users/'+arr.join('-'),//请求的地址
      data:{},
      success:function(result){//成功的回调函数
        location.reload();
      }
    })
  }
})