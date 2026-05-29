using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CafeAPI.DTOs;
using CafeAPI.Models;
using CafeAPI.Repositories;

namespace CafeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;

        public ProductsController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetAll()
        {
            var products = await _productRepository.GetAllAsync();
            var dtos = products.Select(p => MapToDTO(p));
            return Ok(dtos);
        }

        // GET: api/products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> GetById(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm" });

            return Ok(MapToDTO(product));
        }

        // GET: api/products/category/1
        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetByCategory(int categoryId)
        {
            var products = await _productRepository.GetByCategoryAsync(categoryId);
            return Ok(products.Select(p => MapToDTO(p)));
        }

        // POST: api/products
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ProductDTO>> Create([FromBody] CreateProductDTO dto)
        {
            var product = new Product
            {
                ProductName = dto.ProductName,
                Description = dto.Description,
                Price = dto.Price,
                CategoryID = dto.CategoryID,
                IsActive = true
            };

            var created = await _productRepository.AddAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = created.ProductID }, MapToDTO(created));
        }

        // PUT: api/products/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ProductDTO>> Update(int id, [FromBody] UpdateProductDTO dto)
        {
            var product = new Product
            {
                ProductName = dto.ProductName,
                Description = dto.Description,
                Price = dto.Price,
                CategoryID = dto.CategoryID
            };

            var updated = await _productRepository.UpdateAsync(id, product);
            if (updated == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm" });

            return Ok(MapToDTO(updated));
        }

        // DELETE: api/products/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _productRepository.SoftDeleteAsync(id);
            if (!result)
                return NotFound(new { message = "Không tìm thấy sản phẩm" });

            return Ok(new { message = "Đã xóa sản phẩm thành công" });
        }

        private static ProductDTO MapToDTO(Product p) => new ProductDTO
        {
            ProductID = p.ProductID,
            ProductName = p.ProductName,
            Description = p.Description,
            Price = p.Price,
            CategoryID = p.CategoryID,
            CategoryName = p.Category?.CategoryName,
            IsActive = p.IsActive
        };
    }
}
