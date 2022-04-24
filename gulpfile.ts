import gulp from 'gulp';
import { spawnSync } from 'child_process';
import fs from 'fs';
import yargs from 'yargs';

const silentError = new Error('');
silentError.stack = ' ';

gulp.task('config', (cb) => {
  const CONSUL_ADDRESS = 'https://consul.tools.cencox.xyz'
  const CONSUL_VERSION = '0.25.0'
  const argv = yargs.options({
    'environment': {
      alias: 'e',
      default: 'development',
      demandOption: true,
      describe: 'environment files to download in consul',
      type: 'string'
    },
    'consul': {
      alias: 'c',
      default: CONSUL_ADDRESS,
      demandOption: true,
      describe: 'Consul Address',
      type: 'string'
    },
    'token': {
      alias: 't',
      demandOption: true,
      describe: 'Consul Token',
      type: 'string'
    },
    'level': {
      default: 'info',
      demandOption: true,
      describe: 'Log level',
      type: 'string'
    }
  }).argv;

  const os = require('os');
  const isMacOs = os.platform() === 'darwin';
  const consulExecutable = `${isMacOs ? '' : './'}consul-template`;
  const result = spawnSync([
    `curl https://releases.hashicorp.com/consul-template/${CONSUL_VERSION}/consul-template_${CONSUL_VERSION}_linux_amd64.zip -o consul-template.zip`,
    'unzip consul-template.zip',
    [
      `ENVIRONMENT=${argv.environment} ${consulExecutable}`,
      `-log-level ${argv.level}`,
      '-once',
      '-config "./consul/config.hcl"',
      `-consul-addr "${argv.consul}"`,
      `-consul-token "${argv.token}"`
    ].join(' ')
  ].join(' && '), {
    stdio: 'inherit',
    shell: true
  });

  // Always remove dirty
  spawnSync([
    'rm -f consul-template',
    'rm -f consul-template.zip',
    'rm -f consul-template.pid'
  ].join(' && '), {
    stdio: 'inherit',
    shell: true
  });

  if (result.status !== 0) {
    const err = new Error('');
    err.stack = ' ';
    return cb(err);
  }
  cb();
});

gulp.task('validate', (cb) => {
  const result = spawnSync('npm run env -- eslint \'*/**/*.{js,ts,tsx}\' --quiet --fix', {
    stdio: 'inherit',
    shell: true
  });

  if (result.status == 1) {
    const err = new Error('');
    err.stack = ' ';
    return cb(err);
  }
  cb();
});

gulp.task('docs', gulp.series('validate', (cb) => {
  const tmplPath = './.tmpl.readme.md';
  if (!fs.existsSync(tmplPath)) {
    return cb();
  }
  const packageJSON = require('./package.json');
  let tmpl = fs.readFileSync(tmplPath).toString('utf-8');

  const transpile = (key: string, value: string): void => {
    tmpl = tmpl.replace(new RegExp('\{\{' + key + '\}\}', 'ig'), value);
  }

  transpile('build:created_at', new Date().toISOString());
  transpile('package:description', packageJSON.description);
  transpile('package:version', packageJSON.version);
  transpile('package:name', packageJSON.name);

  fs.writeFileSync('./Readme.md', tmpl);
  cb();

}));

gulp.task('build', gulp.series('validate', 'docs', (cb) => {
  const result = spawnSync([
    'npm run env -- rimraf ./build',
    'npm run env -- rimraf ./dist',
    'npm run env -- tsc',
    'mv ./build/src ./dist',
    'rm -rf ./build',
    'cp ./package.json ./dist/package.json',
    'cp ./.env.example ./dist/.env.example'
  ].join(' && '), {
    stdio: 'inherit',
    shell: true
  });

  if (result.status !== 0) {
    const err = new Error('');
    err.stack = ' ';
    return cb(err);
  }

  cb();
}));

gulp.task('publish', gulp.series('build', (cb) => {
  // Get semver only in this part , because in prod we dont need this  module
  const semver = require('semver');

  // Important Notes:
  //   Its important that dont do any commit before send the new tag,
  //   because we need to point to the current commit that has a docker build 
  //   manifiest in the registry, 
  //   (if we take another commit , the tag will reference to other commit)

  // We tag to promote to a production env picking the current version tag.
  const packagePath = `${process.cwd()}/package.json`;
  const packageJSON = fs.readFileSync(packagePath).toString('utf-8');
  const packageParsed = JSON.parse(packageJSON);

  const tagCmd = spawnSync([
    `git tag v${packageParsed.version}`,
    `git push origin v${packageParsed.version}`
  ].join(' && '), {
    stdio: 'inherit',
    shell: true
  });
  if (tagCmd.status !== 0) {
    return cb(silentError);
  }

  // Now, we upload all the new builded docs , patch the version , 
  // and prepare for the next promotion ^^.
  // Save all changes before publish
  fs.writeFileSync(packagePath, packageJSON.replace(
    `\"version\": \"${packageParsed.version}\"`,
    `\"version\": \"${semver.inc(packageParsed.version, 'patch')}\"`)
  )

  const prepareForNextCmd = spawnSync([
    'git add .',
    //'git commit -m \'[CI SKIP] update Readme.md and increase the version for the next publish\'',
    'git commit -m \'update Readme.md and increase the version for the next publish\'',
    'git push',
  ].join(' && '), {
    stdio: 'inherit',
    shell: true
  });
  if (prepareForNextCmd.status !== 0) {
    return cb(silentError);
  }

  cb();
}));

gulp.task('local', (cb) => {
  const result = spawnSync(
    [
      'npm run env -- nodemon', // run nodemon for dev
      '-w ./src ', // watch src folder
      '-w ./config/.env', // watch .env file
      '--exec ts-node -r dotenv-safe/config ./src/index.ts dotenv_config_path=./config/.env', // execute dotenv and then index
    ].join(' '),
    {
      stdio: 'inherit',
      shell: true,
    }
  );

  if (result.status !== 0) {
    const err = new Error('');
    err.stack = ' ';
    return cb(err);
  }
  cb();
});

gulp.task('run', (cb) => {
  // Run devspace dev , to work in a cluster environment
  // Link: https://devspace.sh/
  // Pro tip: Devspace UI: http://localhost:8090
  const argv = yargs.options({
    'build': {
      alias: 'b',
      default: false,
      demandOption: false,
      describe: 'Forces to build every image',
      type: 'boolean'
    },
    'namespace': {
      alias: 'n',
      default: 'cencosudx',
      demandOption: false,
      describe: 'The kubernetes namespace to use',
      type: 'string'
    },
    'silent': {
      alias: 's',
      default: true,
      demandOption: false,
      describe: 'Run in silent mode and prevents any devspace log output except panics & fatals',
      type: 'boolean'
    },
    'debug': {
      default: false,
      demandOption: false,
      describe: 'Prints the stack trace if an error occurs',
      type: 'boolean'
    },
  }).argv;
  
  spawnSync([
    `devspace use namespace ${argv.namespace}`,
    [
      'devspace dev',
      argv.build ? ' -b' : '',
      argv.silent ? ' --silent' : '',
      argv.debug ? ' --debug' : ''
    ].join('')
  ].join(' && '), {
    stdio: 'inherit',
    shell: true
  });
  cb();
});
