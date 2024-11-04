using Microsoft.Extensions.Caching.Memory;
using MISA.AMISDemo.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.AMISDemo.Infrastructure.Cache
{
    public class CacheManager : ICacheManager
    {


        private readonly IMemoryCache _cache;

        public CacheManager(IMemoryCache cache)
        {
            _cache = cache;
        }

        public string AddToCache(object data, double expirationMinutes = 30)
        {
            var keyCache = Guid.NewGuid().ToString();
            _cache.Set(keyCache, data, DateTimeOffset.UtcNow.AddMinutes(expirationMinutes));
            return keyCache;
        }

        public object? GetFromCache(string cacheKey)
        {
            return _cache.Get(cacheKey);
        }

        public void RemoveFromCache(string cacheKey)
        {
            _cache.Remove(cacheKey);
        }
    }
}
