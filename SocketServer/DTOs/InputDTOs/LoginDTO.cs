using System.ComponentModel.DataAnnotations;

namespace SocketServer.DTOs.InputDTOs
{
    public class LoginDTO
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
