import api from '../helpers/api'

export default class UserBetsSpecialService {
  static async getAll(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/users/bets/single`)
    return response.data
  }

  static async put(leagueId, data, id = 0) {
    if (!id) {
      id = 0
    }
    console.log(id)
    return await api.put(`api/leagues/${leagueId}/user/bets/single/${id}`, data)
  }
}
