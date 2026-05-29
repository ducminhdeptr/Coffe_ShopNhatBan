namespace CafeAPI.DTOs
{
    public class OrderDTO
    {
        public int OrderID { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public List<OrderDetailDTO> OrderDetails { get; set; } = new();
    }

    public class OrderDetailDTO
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal SubTotal { get; set; }
    }

    public class CreateOrderDTO
    {
        public List<CreateOrderDetailDTO> Items { get; set; } = new();
    }

    public class CreateOrderDetailDTO
    {
        public int ProductID { get; set; }
        public int Quantity { get; set; }
    }

    public class RevenueDTO
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal TotalRevenue { get; set; }
        public int OrderCount { get; set; }
    }
}
