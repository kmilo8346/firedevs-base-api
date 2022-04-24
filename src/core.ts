import plugins, { ILogger, Settings, ISettings } from 'eureka-plugins'

export default {
  logger: (): ILogger => {
    return plugins.getLogger();
  },

  env: (): ISettings => {
    return Settings;
  },

  boot: (callback: () => void): void => {
    // Always use the plugin after hydration
    plugins.on('hydrated', callback);

    // Hydration Process
    plugins.hydrate([
      'eureka-koa-server-plugin',           // lift a server and enable /health route
      'eureka-stackdriver-logger-plugin',   // stack driver logger
    ], (resolver) => {
      const packageJSON = require(`${process.cwd()}/package.json`);
      const environment = Settings.get('K8S_ENVIRONMENT', 'development');
      const cluster = Settings.get('K8S_CLUSTER', 'local');
      const version = ((): string => {
        switch (environment) {
          case 'production': return packageJSON.version
          case 'staging': return Settings.get('DOCKER_BUILD_TAG', 'unknown')
          default: return 'local'
        }
      })();

      // Dependency resolutions Step
      resolver
        // Resolve with the package.json as a buffer stream
        .resolve('packageJSON')
        .withFile('/package.json')
        .resolve('appEnvironment')
        .withValue(environment)
        .resolve('appVersion')
        .withValue(version)
        .resolve('appZone')
        .withValue(cluster)

        // Koa Server
        .resolve('serverPort')
        .withEnvironmentVariable('KOA_SERVER_PORT')

        // Stackdriver Logger
        .resolve('logger')
        .withValue(plugins.getLogger())
        .resolve('googleServiceAccountPath')
        .withFilePath('/config/stack-driver-google-service-account.json')
    })
  }
}

