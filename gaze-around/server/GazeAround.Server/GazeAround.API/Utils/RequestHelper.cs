using System.Text;

namespace GazeAround.API.Utils
{
    public class RequestHelper
    {
        /// <summary>
        /// Выполнить GET запрос, с телом запроса
        /// </summary>
        /// <param name="url">URL для запроса</param>
        /// <returns></returns>
        public async Task<string> SendGetAsync(string url)
        {
            using (var client = new HttpClient())
            using (var request = new HttpRequestMessage(HttpMethod.Get, url))
            {
                using (var response = await client
                    .SendAsync(request, HttpCompletionOption.ResponseContentRead)
                    .ConfigureAwait(false))
                {
                    var responseMessage = response.EnsureSuccessStatusCode();
                    var result = await response.Content.ReadAsStringAsync();
                    return result;
                }
            }
        }

        public async Task<HttpResponseMessage> SendPostAsync(string json, string url)
        {
            using (var client = new HttpClient())
            using (var request = new HttpRequestMessage(HttpMethod.Post, url))
            {
                using (var stringContent = new StringContent(json, Encoding.UTF8, "application/json"))
                {
                    request.Content = stringContent;
                    request.Headers.Add("Authorization", "Bearer NoAuth");
                    using (var response = await client
                        .SendAsync(request, HttpCompletionOption.ResponseHeadersRead)
                        .ConfigureAwait(false))
                    {
                        return response;
                    }
                }
            }
        }


    }
}
