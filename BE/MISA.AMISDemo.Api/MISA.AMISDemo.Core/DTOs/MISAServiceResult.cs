using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.DTOs
{
    public class MISAServiceResult
    {
        public bool Susscess { get; set; }
        public object? Data { get; set; }
        public List<String> Errors { get; set; } = new List<String>();
    }
}
