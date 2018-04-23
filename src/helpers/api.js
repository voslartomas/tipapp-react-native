import { AsyncStorage } from 'react-native'

class Api {
  baseUrl = 'http://192.168.11.103:7300/'

  constructor() {
    if (process.env.REACT_APP_ENV === 'production') {
        this.baseUrl = 'http://18.195.173.121:8001/'
    }
  }

  async get(url) {
    const token = await AsyncStorage.getItem('token')

    return await request.get(this.baseUrl+url)
      .set('Authorization', `Bearer ${token}`)
  }

  async delete(url) {
    const token = await AsyncStorage.getItem('token')

    return await request.delete(this.baseUrl+url)
      .set('Authorization', `Bearer ${token}`)
  }

  async post(url, data) {
    const token = await AsyncStorage.getItem('token')

    return await fetch(this.baseUrl+url, {
      method: 'POST',
      headers: {'Authorization': `Bearer ${token}`},
      body: JSON.stringify(data)
    })
  }

  async put(url, data) {
    const token = await AsyncStorage.getItem('token')

    return await request.put(this.baseUrl+url).send(data)
      .set('Authorization', `Bearer ${token}`)
  }
}

export default new Api()
