export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isSiteHostname = url.hostname === 'joearmani.com' || url.hostname === 'www.joearmani.com';

    if (isSiteHostname && (url.protocol !== 'https:' || url.hostname === 'www.joearmani.com')) {
      url.protocol = 'https:';
      url.hostname = 'joearmani.com';
      return Response.redirect(url.toString(), 308);
    }

    return env.ASSETS.fetch(request);
  },
};
