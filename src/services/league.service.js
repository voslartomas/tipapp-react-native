import api from '../helpers/api'

export default class LeagueService {
  static async getLeagues() {
    const response = await api.get(`/api/leagues/active`)

    return response.data
  }

  static async getBetsMatches(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/bets/matches`)

    return response.data
  }

  static async getLeaderboard(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/leaderboard`)

    return response.data
  }
}
