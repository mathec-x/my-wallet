import { useCallback, useEffect, useRef, useState } from 'react';
import { register } from './PwaServiceWorkerConfig';
import { PromptInstallInterface, ReactPwaProps, UserChoicePrompt } from './PwaTypes';

export default function useRegistration(props: ReactPwaProps) {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration>();
  const [promptInstall, setPromptInstall] = useState<PromptInstallInterface>();
  const [isInstalled, setIsInstalled] = useState<'web' | 'standalone' | 'none'>();
  const [supports, setSupports] = useState<boolean>();
  const [done, setDone] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    const handleFinally = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setDone(true);
      }, 355);
    };

    const handler = () => {
      register(props.config)
        .then((regis) => {
          setRegistration(regis as ServiceWorkerRegistration);
        })
        .catch((err) => {
          if (props?.config?.onError) {
            setSupports(false);
            return props.config.onError(err);
          }
        })
        .finally(handleFinally);
    };
    if (typeof window !== 'undefined') {
      handler();
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [props]);

  useEffect(() => {

    const checkSupport = (e: PromptInstallInterface) => {
      setPromptInstall(e);
    };

    const appInstalled = () => {
      setDone(true);
      setSupports(true);
      setIsInstalled('standalone');
    };

    if (typeof window !== undefined) {
      if ('serviceWorker' in navigator) {
        setIsInstalled('none');
        setSupports(true);
        window.addEventListener('beforeinstallprompt', checkSupport);
      }

      if (window.matchMedia('(display-mode: standalone)').matches) {
        appInstalled();
      }

      window.addEventListener('appinstalled', appInstalled);
    }

    return () => {
      if (typeof window !== undefined) {
        window.removeEventListener('beforeinstallprompt', checkSupport);
        window.removeEventListener('appinstalled', appInstalled);
      }
    };
  }, [registration]);

  const onClickInstall = useCallback((evt?: Event) => {
    if (evt && evt.preventDefault) {
      evt.preventDefault();
    }

    promptInstall?.prompt()
      .then((e) => {
        if (props?.config?.onPrompt) {
          return props.config.onPrompt(e as unknown as UserChoicePrompt);
        }
      })
      .catch((e) => {
        if (props?.config?.onPrompt) {
          return props.config.onPrompt(e);
        }
      });

  }, [promptInstall, props.config]);

  return {
    install: onClickInstall,
    supports,
    isInstalled,
    registration,
    done
  };
};