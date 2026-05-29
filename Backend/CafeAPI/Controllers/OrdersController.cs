using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CafeAPI.DTOs;
using CafeAPI.Models;
using CafeAPI.Repositories;

namespace CafeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;

        public OrdersController(IOrderRepository orderRepository, IProductRepository productRepository)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
        }

        // GET: api/orders
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _orderRepository.GetAllAsync();
            var dtos = orders.Select(o => new OrderDTO
            {
                OrderID = o.OrderID,
                OrderDate = o.OrderDate,
                TotalAmount = o.TotalAmount,
                OrderDetails = o.OrderDetails.Select(od => new OrderDetailDTO
                {
                    ProductID = od.ProductID,
                    ProductName = od.Product?.ProductName ?? "",
                    Quantity = od.Quantity,
                    SubTotal = od.SubTotal
                }).ToList()
            });
            return Ok(dtos);
        }

        // POST: api/orders
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOrderDTO dto)
        {
            var order = new Order
            {
                OrderDate = DateTime.Now,
                OrderDetails = new List<OrderDetail>()
            };

            decimal totalAmount = 0;

            foreach (var item in dto.Items)
            {
                var product = await _productRepository.GetByIdAsync(item.ProductID);
                if (product == null)
                    return BadRequest(new { message = $"Sản phẩm ID {item.ProductID} không tồn tại" });

                var subTotal = product.Price * item.Quantity;
                totalAmount += subTotal;

                order.OrderDetails.Add(new OrderDetail
                {
                    ProductID = item.ProductID,
                    Quantity = item.Quantity,
                    SubTotal = subTotal
                });
            }

            order.TotalAmount = totalAmount;
            var created = await _orderRepository.CreateAsync(order);

            return CreatedAtAction(nameof(GetAll), new { id = created.OrderID }, new
            {
                orderId = created.OrderID,
                totalAmount = created.TotalAmount,
                message = "Đặt hàng thành công!"
            });
        }

        // GET: api/orders/revenue
        [HttpGet("revenue")]
        [Authorize]
        public async Task<IActionResult> GetRevenue()
        {
            var revenue = await _orderRepository.GetMonthlyRevenueAsync();
            return Ok(revenue);
        }
    }
}
