using Microsoft.EntityFrameworkCore;
using CafeAPI.Data;
using CafeAPI.Models;

namespace CafeAPI.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly CafeDbContext _context;

        public CategoryRepository(CafeDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            return await _context.Categories.OrderBy(c => c.CategoryID).ToListAsync();
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            return await _context.Categories.FindAsync(id);
        }
    }
}
