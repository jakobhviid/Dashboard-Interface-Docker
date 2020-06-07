using System.ComponentModel.DataAnnotations;

namespace SocketServer.DTOs.InputDTOs
{
    public class NewUserDTO
    {
        [Required]
        public string APIKey { get; set; }

        [Required]
        [MaxLength(100)]
        public string NewUserEmail { get; set; }

        [Required]
        public string NewUserPassword { get; set; }
    }
}
