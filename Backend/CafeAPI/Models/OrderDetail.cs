using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CafeAPI.Models
{
    [Table("OrderDetails")]
    public class OrderDetail
    {
        [Key]
        public int OrderDetailID { get; set; }

        public int OrderID { get; set; }

        public int ProductID { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal SubTotal { get; set; }

        // Navigation properties
        [ForeignKey("OrderID")]
        [JsonIgnore]
        public virtual Order? Order { get; set; }

        [ForeignKey("ProductID")]
        public virtual Product? Product { get; set; }
    }
}
