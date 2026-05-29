using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CafeAPI.Services;

namespace CafeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ForecastController : ControllerBase
    {
        private readonly IForecastService _forecastService;

        public ForecastController(IForecastService forecastService)
        {
            _forecastService = forecastService;
        }

        // GET: api/forecast
        [HttpGet]
        public async Task<IActionResult> GetForecast()
        {
            var forecast = await _forecastService.GetForecastAsync();
            return Ok(forecast);
        }
    }
}
