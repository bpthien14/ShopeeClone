export const LocalStorageEventTarget = new EventTarget()

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
} 