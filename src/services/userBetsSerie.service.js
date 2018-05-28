import api from '../helpers/api'

export default class UserBetsSerieService {
  static async getAll(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/users/bets/series`)
    console.log(response.data)
    return response.data
  }

  static async put(leagueId, data, id = 0) {
    delete data.id
    console.log(leagueId, data)
    return await api.put(`api/leagues/${leagueId}/user/bets/series/${id}`, data)
  }
}
