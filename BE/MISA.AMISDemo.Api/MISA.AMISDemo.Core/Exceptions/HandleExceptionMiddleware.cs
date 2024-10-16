using Microsoft.AspNetCore.Http;
using MISA.AMISDemo.Core.DTOs;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Core.Exceptions
{
    public class HandleExceptionMiddleware
    {
        private RequestDelegate _next;
        public HandleExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke (HttpContext context)
        {
            try
            {
                await _next(context);
            } 
            catch (MISAValidateException ex)
            {
                var serviceResult = new MISAServiceResult();
                context.Response.StatusCode = 400;
                serviceResult.Errors.Add(ex.Message);
                var res = JsonConvert.SerializeObject(serviceResult);
                await context.Response.WriteAsync(res);
            }
            catch (Exception ex)
            {
                var serviceResult = new MISAServiceResult();
                context.Response.StatusCode = 500;
                serviceResult.Errors.Add(ex.Message);
                var res = JsonConvert.SerializeObject(serviceResult);
                await context.Response.WriteAsync(res);
            }
        }

    }
}
