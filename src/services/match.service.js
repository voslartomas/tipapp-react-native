import api from '../helpers/api'

export default class MatchService {
  static async getBetMatches(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/bets/matches`)

    return response.data
  }
}
