using Microsoft.EntityFrameworkCore;
using CafeAPI.Data;
using CafeAPI.Models;

namespace CafeAPI.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly CafeDbContext _context;

        public ProductRepository(CafeDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _context.Products
                .Include(p => p.Category)
                .Where(p => p.IsActive)
                .OrderBy(p => p.ProductID)
                .ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.ProductID == id && p.IsActive);
        }

        public async Task<Product> AddAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            // Reload with Category
            await _context.Entry(product).Reference(p => p.Category).LoadAsync();
            return product;
        }

        public async Task<Product?> UpdateAsync(int id, Product product)
        {
            var existing = await _context.Products.FindAsync(id);
            if (existing == null || !existing.IsActive) return null;

            existing.ProductName = product.ProductName;
            existing.Description = product.Description;
            existing.Price = product.Price;
            if (product.CategoryID.HasValue)
                existing.CategoryID = product.CategoryID;

            await _context.SaveChangesAsync();
            await _context.Entry(existing).Reference(p => p.Category).LoadAsync();
            return existing;
        }

        public async Task<bool> SoftDeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            product.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Where(p => p.CategoryID == categoryId && p.IsActive)
                .ToListAsync();
        }
    }
}
