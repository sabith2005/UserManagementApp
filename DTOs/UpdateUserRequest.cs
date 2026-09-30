using System.ComponentModel.DataAnnotations;

namespace UserManagementApp.DTOs
{
    public class UpdateUserRequest
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(200)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Status { get; set; } = "Active";
    }
}