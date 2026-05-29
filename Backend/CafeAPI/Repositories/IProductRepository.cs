using CafeAPI.Models;

namespace CafeAPI.Repositories
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);
        Task<Product> AddAsync(Product product);
        Task<Product?> UpdateAsync(int id, Product product);
        Task<bool> SoftDeleteAsync(int id);
        Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId);
    }
}
