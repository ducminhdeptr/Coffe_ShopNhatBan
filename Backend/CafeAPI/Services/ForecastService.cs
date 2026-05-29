using CafeAPI.DTOs;
using CafeAPI.Repositories;
using System.Globalization;

namespace CafeAPI.Services
{
    public class ForecastService : IForecastService
    {
        private readonly IOrderRepository _orderRepository;

        public ForecastService(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<ForecastDTO> GetForecastAsync()
        {
            var last3Months = await _orderRepository.GetLast3MonthsRevenueAsync();

            // Calculate forecasted revenue as AVG of last 3 months
            decimal forecastedRevenue = 0;
            decimal lastMonthRevenue = 0;
            double changePercentage = 0;
            string trend = "stable";

            if (last3Months.Any())
            {
                forecastedRevenue = last3Months.Average(r => r.TotalRevenue);
                lastMonthRevenue = last3Months.First().TotalRevenue;

                if (lastMonthRevenue > 0)
                {
                    changePercentage = (double)((forecastedRevenue - lastMonthRevenue) / lastMonthRevenue * 100);
                    trend = changePercentage > 2 ? "up" : changePercentage < -2 ? "down" : "stable";
                }
            }

            var monthlyDetails = last3Months.Select(r => new MonthlyRevenueDTO
            {
                Year = r.Year,
                Month = r.Month,
                MonthName = CultureInfo.GetCultureInfo("vi-VN").DateTimeFormat.GetMonthName(r.Month),
                Revenue = r.TotalRevenue
            }).ToList();

            return new ForecastDTO
            {
                ForecastedRevenue = Math.Round(forecastedRevenue, 0),
                LastMonthRevenue = lastMonthRevenue,
                ChangePercentage = Math.Round(changePercentage, 1),
                Trend = trend,
                Last3Months = monthlyDetails
            };
        }
    }
}
