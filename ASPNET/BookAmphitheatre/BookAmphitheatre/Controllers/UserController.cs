using BookAmphitheatre.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace BookAmphitheatre.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserContext _userContext;
        public UserController(UserContext dbContext)
        {
            _userContext = dbContext;
        }

        [Route("api/addUser")]
        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] User user)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    await _userContext.Users.AddAsync(user);
                    await _userContext.SaveChangesAsync();

                    return Ok();
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            var existingUser = await _userContext.Users
                .FirstOrDefaultAsync(u => u.email == user.email && u.password == user.password);

            if (existingUser == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            HttpContext.Session.SetInt32("UserId", existingUser.id);
            Console.WriteLine($"Login successful user id is: {existingUser.id}");

            var sessionUserId = HttpContext.Session.GetInt32("UserId");
            Console.WriteLine($"Session UserId: {sessionUserId}");

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.Now.AddDays(1),
                Path = "/"
            };

            Response.Cookies.Append("UserName", existingUser.name, cookieOptions);
            Response.Cookies.Append("role", existingUser.role, cookieOptions);

            return Ok(new { message = "Login successful", userName = existingUser.name, role = existingUser.role});
        }

        [HttpPost("validate")]
        public IActionResult ValidateSession()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            Console.WriteLine($"Hello {userId}");
            if (userId == null)
            {
                return Unauthorized(new { message = "Invalid session" });
            }

            var user = _userContext.Users.Find(userId);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid session" });
            }

            return Ok(new { userName = user.name });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();

            if (Request.Cookies["UserName"] != null)
            {
                var cookieOptions = new CookieOptions
                {
                    Expires = DateTime.Now.AddDays(-1),
                    Path = "/"
                };

                Response.Cookies.Append("UserName", "", cookieOptions);
            }

            if (Request.Cookies["role"] != null)
            {
                var cookieOptions = new CookieOptions
                {
                    Expires = DateTime.Now.AddDays(-1),
                    Path = "/"
                };

                Response.Cookies.Append("role", "", cookieOptions);
            }

            return Ok(new { message = "Logout successful" });
        }
    }
}
