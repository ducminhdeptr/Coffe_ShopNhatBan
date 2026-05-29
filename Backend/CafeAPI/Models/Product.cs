using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeAPI.Models
{
    [Table("Products")]
    public class Product
    {
        [Key]
        public int ProductID { get; set; }

        [Required]
        [MaxLength(100)]
        public string ProductName { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public int? CategoryID { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation property
        [ForeignKey("CategoryID")]
        public virtual Category? Category { get; set; }
    }
}
