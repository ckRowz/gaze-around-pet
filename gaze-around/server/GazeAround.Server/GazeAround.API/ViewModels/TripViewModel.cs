namespace GazeAround.API.ViewModels
{
    public class TripViewModel
    {
        public string Xid { get; set; }
        public string Kinds { get; set; }
        public double Dist { get; set; }
        public double TravelTime { get; set; }
        public string Name { get; set; }
        public PointViewModel Point { get; set; }

        const double AVG_HUMAN_SPEED = 3.8;

        public TripViewModel(string xid, string kinds, double dist, string name, PointViewModel point)
        {
            Xid = xid;
            Kinds = kinds;
            Dist = dist;
            TravelTime = dist / 1000 / AVG_HUMAN_SPEED * 60;
            Name = name;
            Point = point;
        }
    }
}
