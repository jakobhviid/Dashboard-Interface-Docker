const kilobyte_size = 1000;
const megabyte_size = kilobyte_size * kilobyte_size;
const gigabyte_size = megabyte_size * kilobyte_size;

export function calculateAppropiateByteType(bytes) {
  const num_digits = bytes.toString().length;
  if (num_digits <= kilobyte_size.toString().length + 1)
    return (bytes / kilobyte_size).toFixed(1).toString() + " KB";
  else if (num_digits <= megabyte_size.toString().length + 1)
    return (bytes / megabyte_size).toFixed(1).toString() + " MB";
  else if (num_digits <= gigabyte_size.toString().length + 1)
    return (bytes / gigabyte_size).toFixed(1).toString() + "GB";
}
