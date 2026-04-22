import axios from 'axios';

const META_API_BASE = 'https://graph.facebook.com/v20.0';

/**
 * All Meta Marketing API calls must go through this client.
 * Never call the Meta API directly from routes or services.
 */
export class MetaClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request<T>(
    method: 'get' | 'post' | 'delete',
    path: string,
    data?: Record<string, unknown>
  ): Promise<T> {
    const response = await axios({
      method,
      url: `${META_API_BASE}${path}`,
      params: method === 'get' ? { access_token: this.accessToken, ...data } : undefined,
      data: method !== 'get' ? { access_token: this.accessToken, ...data } : undefined,
    });
    return response.data as T;
  }

  async createCampaign(adAccountId: string, params: {
    name: string;
    objective: string;
    status: 'ACTIVE' | 'PAUSED';
  }) {
    return this.request('post', `/act_${adAccountId}/campaigns`, params);
  }

  async createAdSet(adAccountId: string, params: Record<string, unknown>) {
    return this.request('post', `/act_${adAccountId}/adsets`, params);
  }

  async uploadAdImage(adAccountId: string, imageUrl: string) {
    return this.request('post', `/act_${adAccountId}/adimages`, { url: imageUrl });
  }

  async createAdCreative(adAccountId: string, params: Record<string, unknown>) {
    return this.request('post', `/act_${adAccountId}/adcreatives`, params);
  }

  async createAd(adAccountId: string, params: Record<string, unknown>) {
    return this.request('post', `/act_${adAccountId}/ads`, params);
  }

  async getAdStatus(adId: string) {
    return this.request('get', `/${adId}`, { fields: 'status,review_feedback' });
  }

  async getAdAccounts(): Promise<{ data: Array<{ id: string; name: string; account_id: string }> }> {
    return this.request('get', '/me/adaccounts', { fields: 'id,name,account_id' });
  }

  async getPages(): Promise<{ data: Array<{ id: string; name: string }> }> {
    return this.request('get', '/me/accounts', { fields: 'id,name' });
  }

  static async exchangeCodeForToken(code: string, redirectUri: string): Promise<string> {
    const appId = process.env.META_APP_ID!;
    const appSecret = process.env.META_APP_SECRET!;
    const resp = await axios.get('https://graph.facebook.com/v20.0/oauth/access_token', {
      params: { client_id: appId, client_secret: appSecret, redirect_uri: redirectUri, code },
    });
    return resp.data.access_token as string;
  }

  static async getLongLivedToken(shortLivedToken: string): Promise<string> {
    const appId = process.env.META_APP_ID!;
    const appSecret = process.env.META_APP_SECRET!;
    const resp = await axios.get('https://graph.facebook.com/v20.0/oauth/access_token', {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: appId,
        client_secret: appSecret,
        fb_exchange_token: shortLivedToken,
      },
    });
    return resp.data.access_token as string;
  }
}
