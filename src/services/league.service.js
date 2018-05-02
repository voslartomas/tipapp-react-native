import api from '../helpers/api'

export default class LeagueService {
  static async getLeagues() {
    const response = await api.get(`/api/leagues/active`)

    return response.data
  }
  static async getBetsMatches(leagueId, date = '2018-04-29') {
    const response = await api.get(`api/leagues/${leagueId}/bets/matches?date=${date}`)

    return response.data
  }
}
