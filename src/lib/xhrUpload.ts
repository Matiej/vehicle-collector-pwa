export function xhrUpload({
  url,
  formData,
  onProgress,
  headers,
}: {
  url: string;
  formData: FormData;
  headers?: Record<string, string>;
  onProgress?: (percent: number) => void;
}): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', url, true);
    // xhr.withCredentials = true; // jeśli masz ciasteczka; w przeciwnym razie usuń

    // Nigdy NIE ustawiaj Content-Type przy FormData (boundary dodaje przeglądarka)
    if (headers) {
      Object.entries(headers).forEach(([k, v]) => {
        const low = k.toLowerCase();
        if (low === 'content-type') return; // ignoruj
        xhr.setRequestHeader(k, v);
      });
    }

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (evt) => {
        if (!evt.lengthComputable) return;
        onProgress(Math.round((evt.loaded / evt.total) * 100));
      };
    }

    xhr.onload = () => {
      const text = xhr.responseText ?? '';
      if (xhr.status >= 200 && xhr.status < 300) {
        try { resolve(text ? JSON.parse(text) : {}); }
        catch { resolve({}); }
      } else {
        reject(new Error(`HTTP ${xhr.status} ${xhr.statusText} :: ${text}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(formData);
  });
}
