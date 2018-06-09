import api from '../helpers/api'

export default class TeamService {
  static async getAll(leagueId) {
      const response = await api.get(`api/leagues/${leagueId}/teams/`)

      return response.data
  }
}
