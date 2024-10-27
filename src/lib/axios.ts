import axios from 'axios'

const request = axios.create()

request.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (
      error.response &&
      [401, 403, 400, 405].includes(error.response.status)
    ) {
      const { data } = error.response
      return Promise.resolve({
        data: null,
        status: error.response.status,
        error: data?.error || '未登录',
        message: data?.message || '未登录'
      })
    }
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    return Promise.reject(error)
  }
)

export default request
