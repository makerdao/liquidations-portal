import mixpanel from 'mixpanel-browser';

const env = process.env.NODE_ENV === 'production' ? 'prod' : 'prod';

const config = {
  prod: {
    mixpanel: {
      token: 'b937718de4290b8bf3fda4e0bfabe111',
      config: { ip: false, api_host: 'https://api.mixpanel.com' }
    }
  }
}[env];

export const mixpanelInit = () => {
  console.debug(`[Mixpanel] Tracking initialized for ${env} env using ${config.mixpanel.token}`);
  mixpanel.init(config.mixpanel.token, config.mixpanel.config);
  mixpanel.track('Pageview', { product: 'liquidations-portal' });
};
