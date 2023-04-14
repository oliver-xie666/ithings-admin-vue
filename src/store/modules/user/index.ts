import { defineStore } from 'pinia'
import { MD5 } from 'crypto-js'
import type { LocationQuery } from 'vue-router'
import { getUID, removeToken, setToken, setUID, toLogin } from '@/utils'
import { usePermissionStore, useTabStore } from '@/store'
import { addDynamicRoutes, resetRouter, router } from '@/router'
import { postApiV1SystemUserLogin, postApiV1SystemUserRead } from '~/src/api/yonghuguanli'
import type { LoginInfo } from '~/src/views/login/login'

interface UserInfo {
  userName?: string
  nickName?: string
  roleArr?: Array<string>
  avatar?: string
}

const RoleEnum = new Map([
  [
    1, 'admin',
  ],
  [
    2, 'normal',
  ],
  [
    3, 'subAdmin',
  ],
])

export const useUserStore = defineStore('user', {
  state() {
    return {
      userInfo: <UserInfo> {},
    }
  },
  getters: {

    userName(): string {
      return this.userInfo.userName || ''
    },
    nickName(): string {
      return this.userInfo.nickName || ''
    },
    role(): Array<string> {
      return this.userInfo.roleArr || []
    },
    avatar(): string {
      return this.userInfo.avatar || ''
    },
  },
  actions: {
    async getUserInfo() {
      const avatar
  = 'https://p26-passport.byteacctimg.com/img/user-avatar/d7e592d60c58f00ecb4957f1de203dfa~300x300.image'

      try {
        const res = await postApiV1SystemUserRead({ uid: getUID() as string })
        if (res?.code === 200) {
          const { userName, nickName, role } = res.data
          const roleArr: Array<string> = []
          roleArr.push(RoleEnum.get(role) as string)
          if (avatar)
            this.userInfo = { userName, nickName, roleArr, avatar }
          return Promise.resolve(res.data)
        }
        else {
          return Promise.reject(res)
        }
      }
      catch (error) {
        return Promise.reject(error)
      }
    },
    async loginIn(loginInfo: LoginInfo, query: LocationQuery): Promise<boolean> {
      const { userID, password, codeID, code } = loginInfo
      const res = await postApiV1SystemUserLogin({ pwdType: 2, loginType: 'pwd', userID, password: MD5(password).toString(), codeID, code })
      if (res.code === 200) {
        window.$message?.success('登录成功！', { duration: 2500 })
        setToken(res.data.token.accessToken)
        setUID(res?.data?.info?.uid ?? '')
        await addDynamicRoutes()
        if (query.redirect) {
          const path = query.redirect as string
          Reflect.deleteProperty(query, 'redirect')
          router.push({ path, query })
        }
        else {
          router.push('/')
        }
        return true
      }
      return false
    },
    async logout() {
      const { resetTabs } = useTabStore()
      const { resetPermission } = usePermissionStore()
      removeToken()
      resetPermission()
      resetTabs()
      resetRouter()
      this.$reset()
      router.push({ name: 'Login', replace: true })
      toLogin()
    },
    setUserInfo(userInfo = {}) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
  },
})
