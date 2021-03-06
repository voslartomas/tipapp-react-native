import api from '../helpers/api'

export default class LeagueService {
  static async getLeagues() {
    const response = await api.get(`/api/leagues/active`)

    return response.data
  }

  static async getBetsMatches(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/bets/matches?history=false&order=ASC&limitDays=30`)

    return response.data
  }

  static async getBetsMatchesHistory(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/bets/matches?history=true&order=DESC`)

    return response.data
  }

  static async getLeaderboard(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/leaderboard`)

    return response.data
  }

  static async getUserBetsMatch(leagueId, matchId) {
    const response = await api.get(`api/leagues/${leagueId}/users/bets/match/${matchId}`)

    return response.data
  }

  static async getUserBetsSingle(leagueId, singleId) {
    const response = await api.get(`api/leagues/${leagueId}/users/bets/single/${singleId}`)

    return response.data
  }

  static async getUserBetsSerie(leagueId, serieId) {
    const response = await api.get(`api/leagues/${leagueId}/users/bets/serie/${serieId}`)
    
    return response.data
  }
}
