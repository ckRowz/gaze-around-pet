using GazeAround.API.Services;
using GazeAround.API.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace GazeAround.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TripController : ControllerBase
    {               
        private readonly ILogger<TripController> _logger;
        private readonly ITripApi _tripApi;

        public TripController(ILogger<TripController> logger, TripApi tripApi)
        {
            _logger = logger;
            _tripApi = tripApi;
        }

        [HttpGet(Name = "GetTrips")]
        public async Task<IEnumerable<TripViewModel>> Get(int radius, double lon, double lat)
        {
            return await _tripApi.GetTripsByLocationAsync(radius, lon, lat);
        }
    }
}