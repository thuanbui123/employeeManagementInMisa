using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Services
{
    public class PositionService : BaseService<Position>, IPositionService
    {
        private IPositionRepository _positionRepository;
        public PositionService(IPositionRepository _repository) : base(_repository)
        {
            _positionRepository = _repository;
        }
    }
}
