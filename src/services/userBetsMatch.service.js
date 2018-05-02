import api from '../helpers/api'

export default class UserBetsMatchService {
  static async getAll(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/user/bets/match`)

    return response.data
  }

  static async put(leagueId, data, id = 0) {
    return await api.put(`api/leagues/${leagueId}/user/bets/match/${id}`, data)
  }
}
