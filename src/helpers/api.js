import { AsyncStorage } from 'react-native'
import axios from 'axios'

class Api {
  baseUrl = 'http://192.168.11.103:7300/'
  request = undefined

  constructor() {
    if (process.env.REACT_APP_ENV === 'production') {
        this.baseUrl = 'http://18.195.173.121:8001/'
    }
  }

  async init() {
    const token = await AsyncStorage.getItem('token')
    this.request = axios.create({
      baseURL: this.baseUrl,
      timeout: 2000,
      headers: {'Authorization': `Bearer ${token}`}
    });
  }

  async get(url) {
    await this.init()
    return await this.request.get(url)
  }

  async delete(url) {
    await this.init()
    return await this.request.delete(url)
  }

  async post(url, data) {
    await this.init()
    return await this.request.post(url, data)
  }

  async put(url, data) {
    await this.init()
    return await this.request.put(turl, data)
  }
}

export default new Api()
