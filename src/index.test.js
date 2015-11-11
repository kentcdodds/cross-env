import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import getPathVar from 'manage-path/dist/get-path-var';
chai.use(sinonChai);

const {expect} = chai;
const proxied = {
  'cross-spawn': {
    spawn: sinon.spy(() => 'spawn-returned')
  }
};

const crossEnv = proxyquire('./index', proxied);

describe(`cross-env`, () => {

  beforeEach(() => {
    proxied['cross-spawn'].spawn.reset();
  });

  it(`should set environment variables and run the remaining command`, () => {
    testEnvSetting('FOO_ENV=production');
  });

  it(`should handle multiple env variables`, () => {
    testEnvSetting('FOO_ENV=production', 'bar_env=dev');
  });

  it(`should do nothing given no command`, () => {
    crossEnv([]);
    expect(proxied['cross-spawn'].spawn).to.have.not.been.called;
  });

  function testEnvSetting(...envSettings) {
    const ret = crossEnv([...envSettings, 'echo', 'hello world']);
    const env = {[getPathVar()]: process.env[getPathVar()]};
    envSettings.forEach(setting => {
      const [prop, val] = setting.split('=');
      env[prop] = val;
    });

    expect(ret, 'returns what spawn returns').to.equal('spawn-returned');
    expect(proxied['cross-spawn'].spawn).to.have.been.calledOnce;
    expect(proxied['cross-spawn'].spawn).to.have.been.calledWith(
      'echo', ['hello world'], {stdio: 'inherit', env}
    );
  }
});
