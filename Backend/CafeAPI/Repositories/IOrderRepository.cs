using CafeAPI.DTOs;
using CafeAPI.Models;

namespace CafeAPI.Repositories
{
    public interface IOrderRepository
    {
        Task<IEnumerable<Order>> GetAllAsync();
        Task<Order?> GetByIdAsync(int id);
        Task<Order> CreateAsync(Order order);
        Task<List<RevenueDTO>> GetMonthlyRevenueAsync();
        Task<List<RevenueDTO>> GetLast3MonthsRevenueAsync();
    }
}
