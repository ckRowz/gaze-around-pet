using Newtonsoft.Json;

namespace GazeAround.API.Static
{
    public static class SettingsManager
    {
        private static string settingsFileName => Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Static", "Settings.json");

        private static Settings _settings;
        public static Settings Settings => _settings ??= LoadSettings();

        private static Exception ThrowSettingsLoadingException(Exception ex)
            => new Exception("Ошибка при загрузке файла настроек", ex);

        private static Settings LoadSettings()
        {
            try
            {
                var fileContent = File.ReadAllText(settingsFileName);
                return JsonConvert.DeserializeObject<Settings>(fileContent)
                    ?? throw ThrowSettingsLoadingException(new ArgumentException("Ошибка при десериализации настроек", nameof(settingsFileName)));
            }
            catch (Exception ex)
            {
                throw ThrowSettingsLoadingException(ex);
            }
        }

        static SettingsManager()
        {
            _settings = LoadSettings();
        }
    }

}
