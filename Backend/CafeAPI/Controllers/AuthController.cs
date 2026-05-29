using Microsoft.AspNetCore.Mvc;
using CafeAPI.Models;
using CafeAPI.Services;

namespace CafeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            var token = _authService.Authenticate(model.Username, model.Password);

            if (token == null)
                return Unauthorized(new { message = "Tên đăng nhập hoặc mật khẩu không đúng" });

            return Ok(new
            {
                token,
                username = model.Username,
                role = "Admin",
                expiresIn = 28800 // 8 hours in seconds
            });
        }
    }
}
