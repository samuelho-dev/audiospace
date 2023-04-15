export const readFileasBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      resolve(base64Image);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};
