using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Model
{
    public class Sport : Base, ISport
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public Sport(Guid id, string name)
        {
            Id = id;
            Name = name;
        }

        public Sport(Guid id, string name, string createdByUserId) : base(createdByUserId)
        {
            Id = id;
            Name = name;
        }

        public Sport(Guid id, string name, string updatedByUserId, DateTime dateUpdated) : base(updatedByUserId, dateUpdated)
        {
            Id = id;
            Name = name;
        }
    }
}
