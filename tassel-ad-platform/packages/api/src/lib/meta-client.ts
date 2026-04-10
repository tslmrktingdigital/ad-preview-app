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
}
