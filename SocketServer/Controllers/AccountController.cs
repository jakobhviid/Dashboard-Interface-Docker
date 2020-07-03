using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using SocketServer.Contracts;
using SocketServer.Data.Models;
using SocketServer.DTOs.InputDTOs;
using SocketServer.DTOs.OutputDTOs;

namespace SocketServer.Controllers
{
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<AccountController> _logger;
        private readonly IConfiguration _configuration;
        private static readonly SigningCredentials SigningCreds = new SigningCredentials(Startup.SecurityKey, SecurityAlgorithms.HmacSha256);

        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager,
            ILogger<AccountController> logger, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost(Contracts.ApiRoutes.AccountRoutes.Login)]
        public async Task<ActionResult> Login(LoginDTO input)
        {
            var signInResult = await _signInManager.PasswordSignInAsync(input.Email, input.Password, false, false);
            if (!signInResult.Succeeded)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new GenericReturnMessageDTO
                {
                    StatusCode = 401,
                        Message = ErrorMessages.IncorrectCredentials
                });
            }

            var claims = new [] { new Claim(ClaimTypes.Email, input.Email) };

            var jwtIssuerAuthorithy = Environment.GetEnvironmentVariable("DASHBOARDI_API_DNS");
            var token = new JwtSecurityToken(jwtIssuerAuthorithy, jwtIssuerAuthorithy, claims, signingCredentials : SigningCreds, expires : DateTime.Now.AddDays(30));
            return StatusCode(StatusCodes.Status200OK, new TokenResponseDTO
            {
                StatusCode = 200,
                    Message = SuccessMessages.UserLoggedIn,
                    Token = new JwtSecurityTokenHandler().WriteToken(token)
            });
        }

        [HttpPost(Contracts.ApiRoutes.AccountRoutes.Register)]
        public async Task<ActionResult> RegisterUser(NewUserDTO input)
        {
            if (!ValidAPIKey(input.APIKey))
                return StatusCode(StatusCodes.Status403Forbidden, new GenericReturnMessageDTO { StatusCode = 403, Message = ErrorMessages.APIKeyIncorrect });

            var user = await _userManager.FindByEmailAsync(input.NewUserEmail);
            if (user != null) // User already exists
                return StatusCode(StatusCodes.Status400BadRequest, new GenericReturnMessageDTO
                {
                    StatusCode = 400,
                        Message = ErrorMessages.UserAlreadyExists
                });

            // create a new user
            var newUser = new ApplicationUser { Email = input.NewUserEmail, UserName = input.NewUserEmail };
            var result = await _userManager.CreateAsync(newUser, input.NewUserPassword);
            if (result.Succeeded)
            {
                // add the email claim and value for this user
                await _userManager.AddClaimAsync(newUser, new Claim(ClaimTypes.Email, input.NewUserEmail));
                // TODO: Confirm email
                return StatusCode(StatusCodes.Status201Created, new GenericReturnMessageDTO
                {
                    StatusCode = 201,
                        Message = SuccessMessages.UserCreated
                });
            }
            else
            {
                return StatusCode(StatusCodes.Status400BadRequest, new GenericReturnMessageDTO
                {
                    StatusCode = 400,
                        Message = result.Errors.Select(e => e.Description)
                });
            }
        }

        private bool ValidAPIKey(string apiKey)
        {
            return apiKey.Equals(Environment.GetEnvironmentVariable("DASHBOARDI_API_KEY"));
        }
    }
}
