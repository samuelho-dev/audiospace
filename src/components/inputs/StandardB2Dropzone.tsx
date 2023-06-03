import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { api } from "~/utils/api";
import {
  RiDeleteBin7Fill,
  RiFileLine,
  RiUploadCloud2Line,
} from "react-icons/ri";

interface StandardB2DropzoneProps {
  bucket: string;
  field: string;
  handleFileChange: (value: string, field: string) => void;
  setPresignedUrl: (value: string | null) => void;
  setProductDownloadFile: (file: File | null) => void;
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

  const [myFiles, setMyFiles] = useState<File[] | null>();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        setProductDownloadFile(acceptedFiles[0]);
        setMyFiles([acceptedFiles[0]]);
      }
    },
    [setProductDownloadFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    maxSize: 5 * 2 ** 30, // ~ 2GB
    multiple: false,
    onDrop,
    onDropAccepted: () => {
      const key = uuidv4();
      fetchPresignedUrls({
        key: key,
        bucket,
      })
        .then((url) => {
          setPresignedUrl(url);
          handleFileChange(key, field);
        })
        .catch((err) => console.error(err));
    },
  });

  const removeAll = () => {
    setProductDownloadFile(null);
    setMyFiles(null);
  };

  return (
    <section
      className={`rounded-sm border border-zinc-700 p-4 ${
        myFiles ? "bg-emerald-600" : ""
      }`}
    >
      {!myFiles && (
        <div {...getRootProps()} className="dropzone-container">
          <input {...getInputProps()} />

          <div className="h-20">
            {isDragActive ? (
              <div className="flex h-full items-center justify-center rounded-sm bg-emerald-600 font-semibold">
                <p>Drop the file here...</p>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 font-semibold">
                <RiUploadCloud2Line size={50} />
                <p>Drag n drop file here, or click to select files</p>
              </div>
            )}
          </div>
        </div>
      )}
      {myFiles && (
        <aside className="my-2">
          <div className="flex items-center gap-2">
            <h4 className=" font-semibold tracking-tighter">
              Files pending upload...
            </h4>
            <div
              className="cursor-pointer rounded-sm bg-zinc-200 p-1"
              onClick={removeAll}
            >
              <RiDeleteBin7Fill size={15} fill="black" />
            </div>
          </div>
          <ul>
            {myFiles.map((file) => (
              <li key={file.name} className="flex items-center gap-2">
                <RiFileLine />
                <h5>
                  {file.name} - {file.size} bytes
                </h5>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </section>
  );
};
