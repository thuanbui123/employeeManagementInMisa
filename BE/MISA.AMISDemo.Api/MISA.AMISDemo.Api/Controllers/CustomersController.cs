using Microsoft.AspNetCore.Mvc;
using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Interfaces;
using MISA.AMISDemo.Infrastructure.Repository;

namespace MISA.AMISDemo.Api.Controllers
{
    [Route("api/v1/customers")]
    [ApiController]
    public class CustomersController : Controller
    {
        private ICustomerRepository _customerRepository;
        private ICustomerService _customerService;

        public CustomersController(ICustomerRepository repository, ICustomerService service)
        {
            _customerRepository = repository;
            _customerService = service;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var customers = _customerRepository.Get();
            return StatusCode(200, customers);
        }

        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            var customers = _customerRepository.Get(id);
            return StatusCode(200, customers);
        }

        [HttpPost]
        public IActionResult InsertCustomer(Customer customer)
        {
            try
            {
                var res = _customerService.InsertService(customer);
                if (res.Susscess == true)
                {
                    return StatusCode(201, res);
                }
                return StatusCode(400, res);
            }
            catch (Exception ex)
            {
                var res = new
                {
                    UserMsg = "Đã có lỗi xảy ra!",
                    DevMsg = ex.Message,
                    Error = ""
                };
                return StatusCode(500, res);
            }
        }
    }
}
