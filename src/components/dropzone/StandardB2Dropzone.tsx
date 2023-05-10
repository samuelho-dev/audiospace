import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { api } from "~/utils/api";
interface StandardB2DropzoneProps {
  bucket: string;
  field: string;
  handleFileChange: (value: string, field: string) => void;
  setPresignedUrl: (value: string | null) => void;
  setProductDownloadFile: (file: File) => void;
}
export const StandardB2Dropzone = ({
  bucket,
  field,
  handleFileChange,
  setProductDownloadFile,
  setPresignedUrl,
}: StandardB2DropzoneProps) => {
  const { mutateAsync: fetchPresignedUrls } =
    api.b2.getStandardUploadPresignedUrl.useMutation();
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      maxFiles: 1,
      maxSize: 5 * 2 ** 30, // ~ 5GB
      multiple: false,
      onDropAccepted: () => {
        const key = uuidv4();

        fetchPresignedUrls({
          key: key,
          bucket,
        })
          .then((url) => {
            setPresignedUrl(url);
            handleFileChange(key, field);
            setSubmitDisabled(false);
          })
          .catch((err) => console.error(err));
      },
    });

  const files = useMemo(() => {
    if (!submitDisabled) {
      return acceptedFiles.map((file) => {
        setProductDownloadFile(file);
        return (
          <li key={file.name}>
            {file.name} - {file.size} bytes
          </li>
        );
      });
    }

    return null;
  }, [acceptedFiles, setProductDownloadFile, submitDisabled]);

  return (
    <section className="border border-zinc-700 p-4">
      <div {...getRootProps()} className="dropzone-container">
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="flex h-full items-center justify-center font-semibold">
            <p>Drop the file here...</p>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center font-semibold">
            <p>Drag n drop file here, or click to select files</p>
          </div>
        )}
      </div>
      <aside className="my-2">
        <h4 className="font-semibold text-zinc-400">Files pending upload</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
};
