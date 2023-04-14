<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui/es/form/src/interface'
import type { LoginInfo } from './login'
import { postApiV1SystemUserCaptcha } from '@/api/yonghuguanli'
import bgImg from '@/assets/images/login_bg.webp'
import { useUserStore } from '~/src/store'

const title: string = import.meta.env.VITE_APP_TITLE
const route = useRoute()
const query = route.query

const loginInfo = ref<LoginInfo>({
  userID: 'administrator',
  password: 'iThings666',
  code: '',
  codeID: '',
  captchaURL: '',

})

const formRef = ref<FormInst | null>(null)

const rules: FormRules = {
  userID: [
    {
      required: true,
      message: '用户名是必填项！',
    },
  ],
  password: [
    {
      required: true,
      message: '密码是必填项！',
    },
  ],
  code: [
    {
      required: true,
      message: '请输入验证码！',
    },
  ],
}

const userStore = useUserStore()

// 获取验证码
const loginVerify = () => {
  const body = {
    type: 'sms',
    data: '',
    use: 'login',
  }

  postApiV1SystemUserCaptcha(body).then((res) => {
    if (typeof res.data === 'object') {
      loginInfo.value.codeID = res.data.codeID ?? ''
      loginInfo.value.captchaURL = res?.data?.url ?? ''
    }
  })
  window.$message?.success('刷新验证码成功！')
}
loginVerify()

async function handleLogin() {
  formRef.value?.validate(async (err) => {
    if (!err) {
      const flag = await userStore.loginIn(loginInfo.value, query)
      if (!flag)
        loginVerify()
    }
    else {
      window.$message?.error('请正确填写登录信息')
      loginVerify()
      return false
    }
  })
}
</script>

<template>
  <AppPage :show-footer="true" bg-cover :style="{ backgroundImage: `url(${bgImg})` }">
    <div m-auto p-15 f-c-c min-w-345 rounded-10 card-shadow bg-white dark:bg-dark bg-opacity-60>
      <div w-380 hidden md:block px-20 py-35>
        <img src="@/assets/images/login_banner.webp" w-full alt="login_banner">
      </div>

      <div w-400 flex-col px-20 py-35>
        <h5 f-c-c text-24 font-normal color="#6a6a6a">
          <img src="@/assets/logo/Group.png" alt="logo" mr-30 text-50 color-primary w-50px>
          {{ title }}
        </h5>
        <div mt-30>
          <n-form ref="formRef" :model="loginInfo" :rules="rules">
            <n-form-item path="userID" h-60>
              <n-input
                v-model:value="loginInfo.userID"
                autofocus
                class="text-16 items-center h-40 pl-4 border-rounded-8"
                placeholder="请输入用户名"
                clearable
              >
                <template #prefix>
                  <TheIcon icon="ant-design:user-outlined" :size="18" />
                  <!-- <n-icon :component="renderIcon('ant-design:user-outlined', { size: 18 })" /> -->
                </template>
              </n-input>
            </n-form-item>
            <n-form-item path="password" h-60>
              <n-input
                v-model:value="loginInfo.password"

                class="text-16 items-center h-40 pl-4 border-rounded-8"
                type="password"
                show-password-on="click"
                placeholder="请输入密码"
                clearable
              >
                <template #prefix>
                  <TheIcon icon="ant-design:lock-outlined" :size="18" />
                </template>
              </n-input>
            </n-form-item>
            <n-form-item path="openCaptcha" h-60>
              <n-input
                v-model:value="loginInfo.code"
                class="text-16 items-center h-40 pl-4 mr-30 border-rounded-8"
                placeholder="请输入验证码"
                :maxlength="6"
                @keydown.enter="handleLogin"
              >
                <template #prefix>
                  <TheIcon icon="ant-design:font-colors-outlined" :size="18" />
                </template>
              </n-input>
              <div border-rounded-8 h-40 class="vPic">
                <img
                  v-middle
                  w-full
                  :src="loginInfo.captchaURL"
                  alt="请输入验证码"
                  @click="loginVerify()"
                >
              </div>
            </n-form-item>
          </n-form>
        </div>

        <div mt-20>
          <n-checkbox class="checkboxed" label="记住我" />
        </div>

        <div mt-20>
          <n-button border-rounded-8 w-full h-40 text-16 type="primary" :loading="loging" @click="handleLogin">
            登录
          </n-button>
        </div>
      </div>
    </div>
  </AppPage>
</template>

<style lang="scss" scoped>
  .vPic {
  width: 60%;
  background: #ccc;
}

::v-deep(.checkboxed.n-checkbox .n-checkbox-box){
  --n-border-radius: 4px;
}
</style>
