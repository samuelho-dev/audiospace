const hashKey = "audiospace";

// UNSECURE HASHING - DO NOT USE FOR SENSITIVE INFO

function hashedString(str: string, key: string) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(
      str.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return result;
}

export function encode(el: string) {
  return Buffer.from(hashedString(el, hashKey)).toString("base64");
}

export function decode(el: string) {
  const decoded = Buffer.from(el, "base64").toString();
  let result = "";
  for (let i = 0; i < decoded.length; i++) {
    const decodedChar = decoded.charCodeAt(i);
    const keyChar = hashKey.charCodeAt(i % hashKey.length);
    const originalChar = String.fromCharCode(decodedChar ^ keyChar);
    result += originalChar;
  }
  return result;
}
