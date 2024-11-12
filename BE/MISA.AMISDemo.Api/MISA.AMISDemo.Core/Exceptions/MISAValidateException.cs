namespace MISA.AMISDemo.Core.Exceptions
{
    public class MISAValidateException : Exception
    {
        private string MsgError = string.Empty;
        public MISAValidateException(string error)
        {
            this.MsgError = error;
        }

        public override string Message => this.MsgError;
    }
}
