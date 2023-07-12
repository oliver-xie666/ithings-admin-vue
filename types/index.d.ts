declare interface Window {
  $loadingBar?: import('naive-ui').LoadingBarProviderInst;
  $dialog?: import('naive-ui').DialogProviderInst;
  $message: import('naive-ui').MessageProviderInst;
  $notification?: import('naive-ui').NotificationProviderInst;
}


declare type Fn<T = any, R = T> = {
  (...arg: T[]): R;
}

declare type ComponentElRef<T extends HTMLElement = HTMLDivElement> = {
  $el: T;
}

declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;

declare type LabelValueOptions = {
  label: string;
  value: any;
  disabled: boolean;
  [key: string]: string | number | boolean;
}[];