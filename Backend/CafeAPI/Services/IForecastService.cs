using CafeAPI.DTOs;

namespace CafeAPI.Services
{
    public interface IForecastService
    {
        Task<ForecastDTO> GetForecastAsync();
    }
}
