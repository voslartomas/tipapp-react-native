import api from '../helpers/api'

export default class PlayerService {
  static async getPlayersByTeams(leagueId, teams) {
      const response = await api.get(`api/leagues/${leagueId}/players/?teams=${teams.join(',')}`)

      return response.data
  }
}
