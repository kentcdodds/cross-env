import chai from 'chai';
import sinonChai from 'sinon-chai';
import proxyquire from 'proxyquire';
chai.use(sinonChai);

const {expect} = chai;

describe(`commandConvert`, () => {
  const platform = process.platform;
  let commandConvert;

  describe(`on Windows`, () =>{
    beforeEach(() =>{
      Object.defineProperty(process, 'platform', {value: 'win32'});
      commandConvert = proxyquire('./command', {});
    });

    afterEach(() =>{
      Object.defineProperty(process, 'platform', {value: platform});
    });

    it(`should convert unix-style env variable usage for windows`, () =>{
      expect(commandConvert('$test')).to.equal('%test%');
    });

    it(`should leave command unchanged when not a variable`, () =>{
      expect(commandConvert('test')).to.equal('test');
    });
  });

  describe(`on Unix-based`, () =>{
    beforeEach(() => {
      Object.defineProperty(process, 'platform', {value: 'linux'});
      commandConvert = proxyquire('./command', {});
    });

    afterEach(() =>{
      Object.defineProperty(process, 'platform', {value: platform});
    });

    it(`should convert windows-style env variable usage for linux`, () =>{
      expect(commandConvert('%test%')).to.equal('$test');
    });

    it(`should leave variable unchanged when using correct operating system`, () =>{
      expect(commandConvert('$test')).to.equal('$test');
    });
  });

});
