export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === 'www.joearmani.com') {
      url.hostname = 'joearmani.com';
      return Response.redirect(url.toString(), 308);
    }

    return env.ASSETS.fetch(request);
  },
};
