import api from '../helpers/api'

export default class MatchService {
  static async getMatches(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/matches/`)

    return response.data
  }
}
