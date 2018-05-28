import api from '../helpers/api'

export default class BetsSerieService {
  static async getAll(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/bets/series`)
    return response.data
  }

  static async getById(leagueId, betId) {
    const response = await api.get(`api/leagues/${leagueId}/bets/series/${betId}`)

    return response.data
  }

  static async delete(leagueId, betId) {
    return await api.delete(`api/leagues/${leagueId}/bets/series/${betId}`)
  }

  static async create(leagueId, data) {
    return await api.put(`api/leagues/${leagueId}/bets/series/0`, data)
  }

  static async update(leagueId, data, id) {
    return await api.put(`api/leagues/${leagueId}/bets/series/${id}`, data)
  }
}
