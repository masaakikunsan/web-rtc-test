import Vue, { ComponentOptions } from 'vue'
import { Route } from 'vue-router'
import { MetaInfo } from 'vue-meta'
import { Context, Middleware, Transition, NuxtApp } from '@nuxt/types/app/index.d'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

interface CustomContext extends Context {
  $axios: NuxtAxiosInstance
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    asyncData?(ctx: CustomContext): Promise<object | void> | object | void
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $nuxt: NuxtApp
    $axios: NuxtAxiosInstance
    $page: any
  }
}
