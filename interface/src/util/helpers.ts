const kilobyte_size = 1000;
const megabyte_size = kilobyte_size * kilobyte_size;
const gigabyte_size = megabyte_size * kilobyte_size;

export function calculateAppropiateByteType(bytes: number) {
  const num_digits = bytes.toString().length;
  if (num_digits <= kilobyte_size.toString().length + 1) return (bytes / kilobyte_size).toFixed(1).toString() + " KB";
  else if (num_digits <= megabyte_size.toString().length + 1) return (bytes / megabyte_size).toFixed(1).toString() + " MB";
  else if (num_digits <= gigabyte_size.toString().length + 1) return (bytes / gigabyte_size).toFixed(1).toString() + "GB";
}

export function removeEmptyNullUndefinedValues(objectToClean: any) {
  for (const key of Object.keys(objectToClean)) {
    const value = objectToClean[key];
    if (value == null) {
      delete objectToClean[key];
      continue;
    } else if (typeof value === "string" && value.length === 0) {
      delete objectToClean[key];
      continue;
    } else if (Array.isArray(value) && value.length === 0) {
      delete objectToClean[key];
      continue;
    } else if (typeof value === "object") {
      if (Object.keys(value).length === 0) {
        delete objectToClean[key];
        continue;
      } else {
        var cleanedInnerObject = removeEmptyNullUndefinedValues(value);
        if (Object.keys(cleanedInnerObject).length === 0) {
          delete objectToClean[key];
          continue;
        }
      }
    }
  }
  return objectToClean;
}

export function downloadBlob(blob: Blob, name: string) {
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement("a");

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  // Remove link from body
  document.body.removeChild(link);
}
