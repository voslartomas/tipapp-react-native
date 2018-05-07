import api from '../helpers/api'

export default class UserBetsMatchService {
  static async put(leagueId, data, id = 0) {
    console.log(data)
    return await api.put(`api/leagues/${leagueId}/user/bets/match/${id}`, data)
  }
}
