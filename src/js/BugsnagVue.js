const Bugsnag = require('@bugsnag/js')
const BugsnagPluginVue = require('@bugsnag/plugin-vue')

const BugsnagVue = {
  start: function(options) {
    const standard = {
      apiKey: process.env.BUGSNAG_API_KEY,
      plugins: [new BugsnagPluginVue()],
      appVersion: process.env.VERSION ?? '1.0.0',
    }
    const onError = {
      onError: function (event) {
        event.errors[0].stacktrace.forEach(function (frame) {
          let domain = (new URL(frame.file));
          frame.file = frame.file.replace(domain.pathname, '/public' + domain.pathname);
        });
        if (event.errors[0].stacktrace[0].method === 'Object.notify') {
          event.errors[0].stacktrace.shift();
        }
        if (undefined !== options && undefined !== options.onError) {
          options.onError(event);
        }
      },
    }
    Bugsnag.start({
        ...standard,
        ...options,
        ...onError
    });
  },
  notify: function (e) {
    Bugsnag.notify(e)
  },
  getVuePlugin: function () {
    return Bugsnag.getPlugin('vue')
  },
  leaveBreadcrumb: function (crumb) {
    Bugsnag.leaveBreadcrumb(crumb)
  },
  addFeatureFlag: function (key, value) {
    Bugsnag.addFeatureFlag(key, value)
  },
  setContext: function (context) {
    Bugsnag.setContext(context)
  },
  setUser: function (id, email, name) {
    Bugsnag.setUser(id, email, name)
  }
}

module.exports = BugsnagVue

module.exports.default = BugsnagVue
