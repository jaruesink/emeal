/// <reference path="../emeal-embed.d.ts" />

import { loadDependencies, addTargetElementBeforeScript } from '../helpers';

interface EmealEmbedSettings {
  isPreview?: boolean;
  title: string;
  description: string;
  image: string;
}

(function () {
  const staticEmbedScript = document.querySelector(
    `script[src$="/static/dist/emeal-embed.min.js"]`
  );

  addTargetElementBeforeScript(staticEmbedScript, 'emeal-embed');
  DOMReady().then(() => loadStatic());

  function loadStatic() {
    const React = window.React;
    const ReactDOM = window.ReactDOM;

    const presetSettings = window.emealStaticSettings;

    const staticStyles = document.querySelector(
      `link[href$="/static/dist/emeal-static.css"]`
    );

    const vendorScript = document.querySelector(
      `script[src$="/static/dist/vendor.js"]`
    );

    const emealProjectId = staticEmbedScript?.getAttribute('data-coupon-id');
    const embedTarget = document.querySelector('#emeal-embed');

    if (!staticEmbedScript || !staticStyles || !vendorScript || !embedTarget)
      return;

    const StaticContent = ({
      settings,
      setLoading,
    }: {
      settings: EmealEmbedSettings;
      setLoading: Function;
    }) => {
      const [email, setEmail] = React.useState('');
      const [imgLoaded, setImgLoaded] = React.useState(false);
      const [error, setError] = React.useState<string>();

      const sendCoupon = async () => {
        const emailValid = validateEmail(email);
        if (!emailValid) return setError('Please enter a valid email.');

        if (settings.isPreview) return setLoading(false);

        const response = await fetch('https://app.emeal.me/api/coupon/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId: emealProjectId,
            email,
          }),
        });
        if (response.status !== 200)
          return setError('An error occurred, let us know.');
        const data = await response.json();
        if (data.errors) return setError('An error occurred, let us know.');
      };

      return (
        <div className='emeal-modal-content'>
          <div
            className={`emeal-modal-content-img ${imgLoaded ? 'loaded' : ''}`}
          >
            <div className='emeal-modal-content-loading'>
              <svg className='emeal-spinner' viewBox='0 0 50 50'>
                <circle
                  className='path'
                  cx='25'
                  cy='25'
                  r='20'
                  fill='none'
                  stroke-width='5'
                ></circle>
              </svg>
            </div>
            <img
              onLoad={() => setImgLoaded(true)}
              src={settings.image}
              height='300'
              width='auto'
              role='presentation'
              alt='coupon graphic'
            />
          </div>
          <h1 className='emeal-modal-title'>{settings.title}</h1>
          <p>{settings.description}</p>
          <div className='emeal-modal-content-row'>
            <div
              className={`emeal-modal-content-input ${error ? 'hasError' : ''}`}
            >
              <input
                type='email'
                name='email'
                id='email'
                value={email}
                onChange={(e) => {
                  if (error) setError('');
                  setEmail(e.target.value);
                }}
                placeholder='Your email'
              />
              {error ? (
                <div className='emeal-modal-content-error'>{error}</div>
              ) : (
                ''
              )}
            </div>

            <button type='button' onClick={sendCoupon}>
              SUBSCRIBE
            </button>
          </div>
          <div className='emeal-modal-link'>
            Powered&nbsp;by&nbsp;
            <a
              href='https://emeal.me'
              target='_blank'
              rel='noopener noreferrer'
            >
              emeal.me
            </a>
          </div>
        </div>
      );
    };

    const StaticContainer = () => {
      const [loading, setLoading] = React.useState<boolean>(true);
      const [settings, setSettings] = React.useState<EmealEmbedSettings>(
        presetSettings
      );

      const configureSettings = async () => {
        const noSettingsOrAlreadyOpened =
          (!presetSettings && !emealProjectId) ||
          (!presetSettings?.isPreview &&
            window.localStorage.getItem('__emeal'));

        if (noSettingsOrAlreadyOpened) return;

        const showOnDelay = presetSettings?.isPreview ? 100 : 2000;
        setTimeout(() => setLoading(false), showOnDelay);

        if (presetSettings?.isPreview) return setSettings(presetSettings);

        const response = await fetch(
          'https://app.emeal.me/api/project/' + emealProjectId,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();

        const badResponseOrDisabled =
          !data || !data.project || data.project.disabledAt;
        if (badResponseOrDisabled) return;
        setSettings(data.project.coupon);
      };

      const createSessionToken = () => {
        const tinyRandom = () => Math.random().toString(36).substring(2);
        return tinyRandom() + tinyRandom() + tinyRandom();
      };

      const markStaticObjectAsViewed = async () => {
        const emealSessionId = createSessionToken();
        console.log('__emeal session id', emealSessionId);
        window.localStorage.setItem('__emeal', emealSessionId);
        // TODO: Do we want to have this be a different endpoint or with a different body?
        await fetch(
          `https://app.emeal.me/api/project/${emealProjectId}/markPageView/${emealSessionId}`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );
      };

      React.useEffect(() => {
        configureSettings();
      }, []);

      React.useEffect(() => {
        if (!window.emealStaticSettings?.isPreview && !!settings && !loading)
          markStaticObjectAsViewed();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [settings, loading]);

      return (
        <StaticContent
          settings={settings as EmealEmbedSettings}
          setLoading={setLoading}
        />
      );
    };

    ReactDOM.render(<StaticContainer />, embedTarget);
  }

  function validateEmail(email: string) {
    var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return re.test(String(email).toLowerCase());
  }

  function DOMReady() {
    return loadDependencies(
      '/static/dist/emeal-static.css',
      '/static/dist/vendor.js'
    ).then(
      () =>
        new Promise((resolve, reject) => {
          if (
            document.readyState === 'interactive' ||
            document.readyState === 'complete'
          ) {
            return resolve();
          }

          if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', () => {
              resolve();
            });
            return;
          }

          reject();
        })
    );
  }
})();
