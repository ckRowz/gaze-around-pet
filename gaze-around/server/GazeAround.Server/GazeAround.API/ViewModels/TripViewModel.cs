namespace GazeAround.API.ViewModels
{

    public class TripViewModel
    {
        public string Name { get; set; }
        public PointViewModel Point { get; set; }

        public TripViewModel(string name, double lat, double lon)
        {
            Name = name;
            Point = new PointViewModel(lat, lon);
        }
    }
}
