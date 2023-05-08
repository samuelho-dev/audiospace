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
