
namespace ResultApp.WebApi.Models.ClubModels
{
    public class ClubToUpdateDto
    {
        public string Name { get; set; }
        public string Logo { get; set; }

        public ClubToUpdateDto(string name, string logo)
        {
            Name = name;
            Logo = logo;
        }
    }
}