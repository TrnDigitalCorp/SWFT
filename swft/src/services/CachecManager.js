const uuidv1 = require('uuid/v1');
uuidv1();

var CacheManager = {
    storageType: window.localStorage,
    storagekeyString: 'ObsidianSWFT2020_',
    storageitem: {
        key: '',
        ExpiryDate: '',
        value: '',
        createdDate: '',
    },

    createCacheItem: (key, jsonObj, expiryHrs) => {
        let storageObj = {},
            now = new Date().getTime(),
            keyStr = CacheManager.storagekeyString + key;
        storageObj.value = jsonObj;
        storageObj.created = now;
        storageObj.expireTime = expiryHrs * 3600000; //miliseconds
        CacheManager.storageType.setItem(keyStr, JSON.stringify(storageObj));
    },
    removeCacheItem: key => {
        let keyStr = '';
        keyStr = CacheManager.storagekeyString + key;
        CacheManager.storageType.removeItem(keyStr);
    },
    updateCacheItem: (key, jsonObj, expiryHrs) => {
        CacheManager.removeCacheItem(key);
        CacheManager.createCacheItem(key, jsonObj, expiryHrs);
    },
    getCacheItem: key => {
        let cacheObj = '',
            jsonObj = '',
            keyStr = '';
        try {
            keyStr = CacheManager.storagekeyString + key;
            cacheObj = CacheManager.storageType.getItem(keyStr);
            jsonObj = JSON.parse(cacheObj);
            return jsonObj;
        } catch (err) {
            console.log(err);
            return jsonObj;
        }
    },
    isCacheExpired: key => {
        let flag = true,
            cacheItem = null,
            now = new Date().getTime();
        try {
            cacheItem = CacheManager.getCacheItem(key);
            if (cacheItem && cacheItem.value) {
                let cacheLapseTime = 0;
                cacheLapseTime = cacheItem.created + cacheItem.expireTime;
                if (cacheLapseTime - now > 0) {
                    flag = true;
                } else {
                    flag = false;
                }
            } else {
                flag = false;
            }
        } catch (error) {
            console.log(error);
            flag = false;
        }
        return flag;
    },
};
export default CacheManager;
