using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Model
{
    public class Base
    {
        public DateTime DateCreated  { get; set; }
        public DateTime DateUpdated { get; set; }
        public string CreatedByUserId { get; set; }
        public string UpdatedByUserId { get; set; }
        public bool IsActive { get; set; } = true;

        public Base() { }
        public Base(string createdByUserId)
        {
            CreatedByUserId = createdByUserId;
        }
        public Base(string updatedByUserId, DateTime dateUpdated)
        {
            UpdatedByUserId = updatedByUserId;
            DateUpdated = dateUpdated;
        }
    }
}
