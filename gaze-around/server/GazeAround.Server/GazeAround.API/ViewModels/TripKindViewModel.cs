namespace GazeAround.API.ViewModels
{
    public class TripKindViewModel
    {
        public string Key { get; set; }
        public string Group { get; set; }
        public string Description { get; set; }

        public TripKindViewModel(string key, string group, string description)
        {
            Key = key;
            Group = group;
            Description = description;
        }
    }
}
