using MISA.AMISDemo.Core.Entities;
using MISA.AMISDemo.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using MySqlConnector;
using System.Data;

namespace MISA.AMISDemo.Infrastructure.Repository
{
    public class CustomerRepository : MISADbContext<Customer>, ICustomerRepository, IDisposable
    {
        public int Delete(Customer item)
        {
            throw new NotImplementedException();
        }

        public void Dispose()
        {
            connection.Dispose();
        }

        public Customer Get(string id) 
        { 
            //Câu lệnh sql lấy dữ liệu
            var sql = $"select * from Customer where customerId = @id";
            var parametes = new DynamicParameters() ;
            parametes.Add("@id", id);
            //thực hiện lấy dữ liệu
            var data = connection.QueryFirstOrDefault<Customer>(sql, param:parametes);

            //trả về dữ liệu
            return data;
        }

        public int Insert(Customer item)
        {
            //Câu lệnh sql lấy dữ liệu
            var sql = $"INSERT INTO Customer (customerId, customerCode, fullName, dateOfBirth, email, adress, phoneNumber, indentityNumber, indentityPlace, indentityDate)" +
                $" Values (@CustomerId, @CustomerCode, @FullName, @DateOfBirth, @Email, @Adress, @PhoneNumber, @IndentityNumber, @IndentityPlace, @IndentityDate)";
            var parametes = new DynamicParameters();
            parametes.Add("@CustomerId", item.CustomerId);
            parametes.Add("@CustomerCode", item.CustomerCode);
            parametes.Add("@FullName", item.FullName);
            parametes.Add("@DateOfBirth", item.DateOfBirth);
            parametes.Add("@Email", item.Email);
            parametes.Add("@Adress", item.Address);
            parametes.Add("@PhoneNumber", item.PhoneNumber);
            parametes.Add("@IndentityNumber", item.IndentityNumber);
            parametes.Add("@IndentityPlace", item.IndentityPlace);
            parametes.Add("@IndentityDate", item.IndentityDate);
            //thực hiện lấy dữ liệu
            var data = connection.Execute(sql, param: parametes);

            //trả về dữ liệu
            return data;
        }

        public int Update(Customer item)
        {
            throw new NotImplementedException();
        }
    }
}
