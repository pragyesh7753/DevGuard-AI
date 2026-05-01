import { useState, useEffect, useCallback } from 'react';

// @ts-ignore — acquireVsCodeApi is injected by VS Code webview runtime
const vscodeApi = typeof acquireVsCodeApi !== 'undefined' ? acquireVsCodeApi() : null;

/**
 * Hook for communicating with the VS Code extension host.
 */
export function useVsCode() {
  const [state, setState] = useState(() => vscodeApi?.getState() || {});

  const postMessage = useCallback((type, data = {}) => {
    if (vscodeApi) {
      vscodeApi.postMessage({ type, ...data });
    }
  }, []);

  const saveState = useCallback((newState) => {
    setState(prev => {
      const merged = { ...prev, ...newState };
      if (vscodeApi) vscodeApi.setState(merged);
      return merged;
    });
  }, []);

  useEffect(() => {
    const handler = (event) => {
      const message = event.data;
      if (message && message.type) {
        window.dispatchEvent(new CustomEvent('vscode-message', { detail: message }));
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return { postMessage, state, saveState, isVsCode: !!vscodeApi };
}

/**
 * Hook to subscribe to specific message types from the extension.
 */
export function useExtensionMessage(type, callback) {
  useEffect(() => {
    const handler = (event) => {
      if (event.detail && event.detail.type === type) {
        callback(event.detail);
      }
    };

    window.addEventListener('vscode-message', handler);
    return () => window.removeEventListener('vscode-message', handler);
  }, [type, callback]);
}
