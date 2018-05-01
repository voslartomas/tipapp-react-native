import api from '../helpers/api'

export default class LeagueService {
  static async getLeagues() {
    const response = await api.get(`/api/leagues/active`)

    return response.data
  }
}
