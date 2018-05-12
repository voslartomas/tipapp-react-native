import api from '../helpers/api'

export default class UserService {
  static async getUsers(leagueId) {
    const response = await api.get('api/users')

    return response.data
  }

  static async getUserById(userId) {
    const response = await api.get(`api/users/${userId}`)

    return response.data
  }

  static async getCurrentUser() {
    const response = await api.get('api/users/current')

    console.log("HELLO")
    console.log(response.data)
    return response.data
  }

  static async delete(userId) {
    return await api.delete(`api/users/${userId}`)
  }

  static async create(data) {
    return await api.post('api/users', data)
  }

  static async update(data, id) {
    return await api.put(`api/users/${id}`, data)
  }
}
