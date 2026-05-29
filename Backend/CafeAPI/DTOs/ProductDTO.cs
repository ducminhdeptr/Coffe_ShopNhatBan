namespace CafeAPI.DTOs
{
    public class ProductDTO
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int? CategoryID { get; set; }
        public string? CategoryName { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateProductDTO
    {
        public string ProductName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int CategoryID { get; set; }
    }

    public class UpdateProductDTO
    {
        public string ProductName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int? CategoryID { get; set; }
    }
}
