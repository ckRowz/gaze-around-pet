namespace GazeAround.API.ViewModels
{
    public class PointViewModel
    {
        public double Lat { get; set; }
        public double Lon { get; set; }

        public PointViewModel(double lat, double lon)
        {
            Lat = lat;
            Lon = lon;
        }
    }
}
