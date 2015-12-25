import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import getPathVar from 'manage-path/dist/get-path-var';
import assign from 'lodash.assign';
chai.use(sinonChai);

const {expect} = chai;
const proxied = {
  'cross-spawn-async': {
    spawn: sinon.spy(() => 'spawn-returned')
  }
};

const crossEnv = proxyquire('./index', proxied);

describe(`cross-env`, () => {

  beforeEach(() => {
    proxied['cross-spawn-async'].spawn.reset();
  });

  it(`should set environment variables and run the remaining command`, () => {
    testEnvSetting({
      FOO_ENV: 'production'
    }, 'FOO_ENV=production');
  });

  it(`should handle multiple env variables`, () => {
    testEnvSetting({
      FOO_ENV: 'production',
      BAR_ENV: 'dev'
    }, 'FOO_ENV=production', 'BAR_ENV=dev');
  });

  it(`should handle special characters`, () => {
    testEnvSetting({
      FOO_ENV: './!?'
    }, 'FOO_ENV=./!?');
  });

  it(`should handle single-quoted strings`, () => {
    testEnvSetting({
      FOO_ENV: 'bar env'
    }, 'FOO_ENV=\'bar env\'');
  });

  it(`should handle double-quoted strings`, () => {
    testEnvSetting({
      FOO_ENV: 'bar env'
    }, 'FOO_ENV="bar env"');
  });

  it(`should handle equality signs in quoted strings`, () => {
    testEnvSetting({
      FOO_ENV: 'foo=bar'
    }, 'FOO_ENV="foo=bar"');
  });

  it(`should do nothing given no command`, () => {
    crossEnv([]);
    expect(proxied['cross-spawn-async'].spawn).to.have.not.been.called;
  });

  function testEnvSetting(expected, ...envSettings) {
    const ret = crossEnv([...envSettings, 'echo', 'hello world']);
    const env = {[getPathVar()]: process.env[getPathVar()]};
    env.APPDATA = process.env.APPDATA;
    assign(env, expected);

    expect(ret, 'returns what spawn returns').to.equal('spawn-returned');
    expect(proxied['cross-spawn-async'].spawn).to.have.been.calledOnce;
    expect(proxied['cross-spawn-async'].spawn).to.have.been.calledWith(
      'echo', ['hello world'], {
        stdio: 'inherit',
        env: assign({}, process.env, env)
      }
    );
  }
});
