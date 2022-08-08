using GazeAround.API.Static;
using GazeAround.API.Utils;
using GazeAround.API.ViewModels;
using Newtonsoft.Json;
using System.Globalization;

namespace GazeAround.API.Services
{
    public class TripApi : ITripApi
    {
        private static RequestHelper _requestHelper = new RequestHelper();
        private static RequestHelper requestHelper => _requestHelper ??= new RequestHelper();

        private readonly NumberFormatInfo _formatInfo = new NumberFormatInfo() { NumberDecimalSeparator = "." };
        //TODO: вынести для клиента, на панель настроек. Получать range с api
        private readonly int _minRadius = 50;
        private readonly int _maxRadius = 2500;
        private readonly int _avgHumanSpeed = 4;

        public async Task<IEnumerable<TripViewModel>> GetTripsByLocationAsync(int radius, double lon, double lat)
        {
            var settings = SettingsManager.Settings;
            var requestResult = await requestHelper.SendGetAsync(settings.TripApiUrl + string.Format(settings.TripApiKey, Math.Max(Math.Min(radius, _maxRadius), _minRadius), lon.ToString(_formatInfo), lat.ToString(_formatInfo)));
            return JsonConvert.DeserializeObject<IEnumerable<TripViewModel>>(requestResult)
                ?.Where(x => !string.IsNullOrWhiteSpace(x.Name))
                ?.OrderBy(x=> x.Dist)
                ?? throw new Exception("Ошибка десериализации данных с внешнего ресурса");
        }
    }
}
