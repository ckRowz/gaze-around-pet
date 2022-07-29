using GazeAround.API.ViewModels;

namespace GazeAround.API.Services
{
    public interface ITripApi
    {
        Task<IEnumerable<TripViewModel>> GetTripsByLocationAsync(int radius, double lng, double lat);
    }
}