const proxyConfigMappings: Record<ProxyType, ProxyConfig> = {
  dev: {
    prefix: '/api',
    target: 'http://106.15.225.172:7777',
  },
  test: {
    prefix: '/api',
    target: 'http://106.15.225.172:7777',
  },
  prod: {
    prefix: '/api',
    target: 'http://106.15.225.172:7777',
  },
}

export function getProxyConfig(envType: ProxyType = 'dev'): ProxyConfig {
  return proxyConfigMappings[envType]
}
