using Microsoft.EntityFrameworkCore;
using CafeAPI.Data;
using CafeAPI.DTOs;
using CafeAPI.Models;

namespace CafeAPI.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly CafeDbContext _context;

        public OrderRepository(CafeDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> GetAllAsync()
        {
            return await _context.Orders
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        public async Task<Order?> GetByIdAsync(int id)
        {
            return await _context.Orders
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.OrderID == id);
        }

        public async Task<Order> CreateAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<List<RevenueDTO>> GetMonthlyRevenueAsync()
        {
            return await _context.Orders
                .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
                .Select(g => new RevenueDTO
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    TotalRevenue = g.Sum(o => o.TotalAmount),
                    OrderCount = g.Count()
                })
                .OrderByDescending(r => r.Year)
                .ThenByDescending(r => r.Month)
                .ToListAsync();
        }

        public async Task<List<RevenueDTO>> GetLast3MonthsRevenueAsync()
        {
            var threeMonthsAgo = DateTime.Now.AddMonths(-3);
            return await _context.Orders
                .Where(o => o.OrderDate >= threeMonthsAgo)
                .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
                .Select(g => new RevenueDTO
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    TotalRevenue = g.Sum(o => o.TotalAmount),
                    OrderCount = g.Count()
                })
                .OrderByDescending(r => r.Year)
                .ThenByDescending(r => r.Month)
                .Take(3)
                .ToListAsync();
        }
    }
}
