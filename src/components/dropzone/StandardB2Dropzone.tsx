import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { api } from "~/utils/api";
interface StandardB2DropzoneProps {
  bucket: string;
  handleFileChange: (value: string) => void;
  setUploadedFile: (boolean: boolean) => void;
}
export const StandardB2Dropzone = ({
  bucket,
  handleFileChange,
  setUploadedFile,
}: StandardB2DropzoneProps) => {
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
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
            console.log({ url, key });
            handleFileChange(key);
            setSubmitDisabled(false);
          })
          .catch((err) => console.error(err));
      },
    });

  const files = useMemo(() => {
    if (!submitDisabled) {
      return acceptedFiles.map((file) => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      ));
    }

    return null;
  }, [acceptedFiles, submitDisabled]);

  const handleSubmit = useCallback(async () => {
    if (acceptedFiles.length > 0 && presignedUrl !== null) {
      const file = acceptedFiles[0] as File;
      console.log(presignedUrl, "presign");
      await axios({
        method: "put",
        url: presignedUrl,
        data: file,
        headers: {
          "Content-Type": file.type,
        },
      })
        .then((response) => {
          console.log(response);
          setUploadedFile(true);

          console.log("Successfully uploaded ", file);
        })
        .catch((err) => console.error(err));
      setSubmitDisabled(true);
    }
  }, [acceptedFiles, presignedUrl, setUploadedFile]);

  return (
    <section className="my-4 border border-zinc-700 p-4">
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
      <button
        onClick={() => void handleSubmit()}
        disabled={
          presignedUrl === null || acceptedFiles.length === 0 || submitDisabled
        }
        className="border border-zinc-300 px-2"
      >
        Upload
      </button>
    </section>
  );
};
