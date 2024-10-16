using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Exceptions
{
    public class MISAValidateException : Exception
    {
        private string MsgError = string.Empty;
        public MISAValidateException(String error)
        {
            this.MsgError = error;
        }

        public override string Message => this.MsgError;
    }
}
