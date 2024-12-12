/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-ed3775ef'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "3ca0b8505b4bec776b69afdba2768812"
  }, {
    "url": "suppress-warnings.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  }, {
    "url": "index.html",
    "revision": "0.v010lotl6h"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html"), {
    allowlist: [/^\/$/]
  }));
  workbox.registerRoute(({
    url
  }) => {
    return true;
  }, new workbox.NetworkFirst({
    "cacheName": "fetch-cache",
    plugins: [new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(({
    url
  }) => url.pathname === "/api/method/lms.lms.utils.get_lesson", new workbox.NetworkFirst({
    "cacheName": "motherfuckingcache",
    plugins: [{
      cacheKeyWillBeUsed: async ({
        request
      }) => {
        console.log("[KYEGEN]: key generation goes brrr...");
        const clonedRequest = request.clone();
        const body = await clonedRequest.text();
        return `${request.url}-${body}`;
      }
    }, {
      fetchDidSucceed: async ({
        response
      }) => {
        console.log("[fetch success]: idk whatsgoingon");
        const clonedResponse = response.clone();
        const headers = new Headers(clonedResponse.headers);
        headers.set("Cache-Control", "max-age=360000");
        return new Response(clonedResponse.body, {
          status: clonedResponse.status,
          statusText: clonedResponse.statusText,
          headers
        });
      }
    }]
  }), 'POST');
  workbox.registerRoute(({
    url
  }) => {
    return true;
  }, new workbox.NetworkFirst({
    "cacheName": "post-cache-v2",
    plugins: [{
      cacheKeyWillBeUsed: async ({
        request
      }) => {
        if (request.method === "POST") {
          const clonedRequest = request.clone();
          const body = await clonedRequest.text();
          return `${request.url}-${body}`;
        }
        return request.url;
      }
    }, {
      fetchDidSucceed: async ({
        response
      }) => {
        const clonedResponse = response.clone();
        const headers = new Headers(clonedResponse.headers);
        headers.set("Cache-Control", "max-age=360000");
        return new Response(clonedResponse.body, {
          status: clonedResponse.status,
          statusText: clonedResponse.statusText,
          headers
        });
      }
    }]
  }), 'POST');

}));
//# sourceMappingURL=sw.js.map
