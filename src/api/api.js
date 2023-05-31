import request from '@/utils/request'

// 账号密码登陆
export const login = data =>{
  return request({
    url: '/api/1/Web_User/Web_Login',
    method: 'post',
    data
  })
}

// 验证码登陆
export const loginByYzm = data => {
  return request({
    url: '/ViewControllers/MobileView/GetNine3UserInfoByYzm',
    method: 'post', 
    data
  })
}

// 上传
export const upLoadFace = (data) => {
  return request({
    url: '/ThirdPartyInterface/UpLoadFace',
    method: 'post',
    data
  })
}

// 获取人脸照片
export const getFace = data => {
  return request({
    url: '/ThirdPartyInterface/GetFace',
    method: 'post',
    data
  })
}