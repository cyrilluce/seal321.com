import * as fetch from "isomorphic-fetch";
import { stringify } from "qs";

const cached = {};
async function fetchJson(url, headers) {
  const options: any = { 
    //   method: 'GET',
      headers
     };
  if (process.env.NODE_ENV === "development") {
    const HttpProxyAgent = require("http-proxy-agent");
    options.agent = new HttpProxyAgent("http://127.0.0.1:1080");
  }
  const response = await fetch(url, options);
  const json = await response.json();
  if (json.error) {
    throw json;
  }
  return json;
}
async function cacheFetch(url: string, params: {}, headers: {} = {}) {
  const fullUrl = url + "?" + stringify(params);
  const key = fullUrl + "#" + JSON.stringify(headers);
  if (!cached[key]) {
    cached[key] = fetchJson(fullUrl, headers);
  }
  cached[key].then(() => {
    delete cached[key];
  });
  return cached[key];
}

export interface GrantAPI {
  getId: (accessToken: string, raw: any) => Promise<string>;
  getName: (accessToken: string, raw: any) => Promise<string>;
  getEmail: (accessToken: string, raw: any) => Promise<string>;
  getAvator: (accessToken: string, raw: any) => Promise<string>;
}

/**
 * 新浪微博接入
 */
export const weibo: GrantAPI = {
  getId: async (token, raw) => {
    return raw.uid;
  },
  getName: async (token, raw) => {
    const json = await cacheFetch("https://api.weibo.com/2/users/show.json", {
      // const json = await cacheFetch("https://api.weibo.com/2/account/profile/basic.json", {
      access_token: token,
      uid: raw.uid
    });
    return json.name;
  },
  getEmail: async (token, raw) => {
    return "";
    // const json = await cacheFetch(
    //   "https://api.weibo.com/2/account/profile/basic.json",
    //   {
    //     access_token: token
    //   }
    // );
    // return json.email;
  },
  getAvator: async (token, raw) => {
    const json = await cacheFetch("https://api.weibo.com/2/users/show.json", {
      access_token: token,
      uid: raw.uid
    });
    return json.profile_image_url;
  }
};

/**
 * google接入
 */
export const google: GrantAPI = {
  getId: async (token, raw) => {
    const json = await cacheFetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {},
      {
        Authorization: "Bearer " + token
      }
    );
    return json.id;
  },
  getName: async (token, raw) => {
    const json = await cacheFetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {},
      {
        Authorization: "Bearer " + token
      }
    );
    return json.name;
  },
  getEmail: async (token, raw) => {
    return "";
  },
  getAvator: async (token, raw) => {
    const json = await cacheFetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {},
      {
        Authorization: "Bearer " + token
      }
    );
    return json.picture;
  }
};

/**
 * facebook接入
 */
export const facebook: GrantAPI = {
  getId: async (token, raw) => {
    const json = await cacheFetch("https://graph.facebook.com/v2.9/me", {
      access_token: token,
      fields: "id,name,email,picture"
    });
    return json.id;
  },
  getName: async (token, raw) => {
    const json = await cacheFetch("https://graph.facebook.com/v2.9/me", {
      access_token: token,
      fields: "id,name,email,picture"
    });
    return json.name;
  },
  getEmail: async (token, raw) => {
    const json = await cacheFetch("https://graph.facebook.com/v2.9/me", {
      access_token: token,
      fields: "id,name,email,picture"
    });
    return json.email;
  },
  getAvator: async (token, raw) => {
    const json = await cacheFetch("https://graph.facebook.com/v2.9/me", {
      access_token: token,
      fields: "id,name,email,picture"
    });
    try {
      return json.picture.data.url;
    } catch (e) {
      return "";
    }
  }
};
