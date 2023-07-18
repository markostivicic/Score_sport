﻿using ResultApp.Model;
using ResultApp.Repository;
using ResultApp.Repository.Common;
using ResultApp.Service.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Service
{
    public class MatchService : IMatchService
    {
        private readonly IMatchRepository _matchRepository;
        public MatchService(IMatchRepository matchRepository)
        {
            _matchRepository = matchRepository;
        }
        public async Task<List<Match>> GetAllAsync()
        {
            return await _matchRepository.GetAllAsync();
        }

        public async Task<Match> GetByIdAsync(Guid id)
        {
            return await _matchRepository.GetByIdAsync(id);
        }

        public async Task<Match> CreateAsync(Match match)
        {
            return await _matchRepository.CreateAsync(match);
        }

        public async Task<Match> UpdateAsync(Guid id, Match match)
        {
            return await _matchRepository.UpdateAsync(id, match);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            return await _matchRepository.DeleteAsync(id);
        }
    }
}
