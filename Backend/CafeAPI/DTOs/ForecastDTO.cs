namespace CafeAPI.DTOs
{
    public class ForecastDTO
    {
        public decimal ForecastedRevenue { get; set; }
        public decimal LastMonthRevenue { get; set; }
        public double ChangePercentage { get; set; }
        public string Trend { get; set; } = "stable"; // "up", "down", "stable"
        public List<MonthlyRevenueDTO> Last3Months { get; set; } = new();
    }

    public class MonthlyRevenueDTO
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public string MonthName { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
    }
}
