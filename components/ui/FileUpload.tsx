"use client";

import type { ChangeEvent, DragEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FileText, ImageIcon, Upload, X } from "lucide-react";
import { Button } from "./Button";
import { Radio } from "./Radio";
import { cn } from "./utils";

interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  helperText?: string;
  onChange?: (files: File[]) => void;
}

interface FilePreview {
  file: File;
  url: string | null;
}

export function FileUpload({
  label = "파일 업로드",
  accept = "image/jpeg,image/png,image/webp",
  multiple = true,
  helperText = "이미지 10MB/장, jpg·png·webp",
  onChange,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const urlsRef = useRef<string[]>([]);
  const [items, setItems] = useState<FilePreview[]>([]);
  const [featured, setFeatured] = useState(0);
  const imageOnly = accept.includes("image");

  const files = useMemo(() => items.map((item) => item.file), [items]);

  useEffect(() => {
    onChange?.(files);
  }, [files, onChange]);

  useEffect(() => () => urlsRef.current.forEach((url) => URL.revokeObjectURL(url)), []);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const nextItems = Array.from(fileList).map((file) => {
      const url = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
      if (url) urlsRef.current.push(url);
      return { file, url };
    });
    setItems((current) => (multiple ? [...current, ...nextItems] : nextItems.slice(0, 1)));
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    addFiles(event.target.files);
    event.target.value = "";
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    addFiles(event.dataTransfer.files);
  }

  function remove(index: number) {
    setItems((current) => {
      const target = current[index];
      if (target?.url) URL.revokeObjectURL(target.url);
      if (target?.url) urlsRef.current = urlsRef.current.filter((url) => url !== target.url);
      return current.filter((_, itemIndex) => itemIndex !== index);
    });
    setFeatured(0);
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-ink">{label}</p>
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        className="rounded-md border border-dashed border-line bg-surface p-5 text-center transition hover:border-primary hover:bg-primary-soft/40"
      >
        <Upload aria-hidden className="mx-auto h-7 w-7 text-muted" />
        <p className="mt-2 text-sm font-semibold text-ink">드래그하거나 클릭해서 추가</p>
        <p className="mt-1 text-xs text-muted">{helperText}</p>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={onInputChange} hidden />
        <Button className="mt-4" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          파일 선택
        </Button>
      </div>

      {items.length > 0 ? (
        imageOnly ? (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((item, index) => (
              <div key={`${item.file.name}-${index}`} className="rounded-md border border-line bg-surface p-2">
                <div className="relative aspect-video overflow-hidden rounded-sm bg-page">
                  {item.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt={item.file.name} className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon aria-hidden className="m-auto h-8 w-8 text-muted" />
                  )}
                  <button
                    type="button"
                    aria-label={`${item.file.name} 삭제`}
                    onClick={() => remove(index)}
                    className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-sm bg-white/90 text-muted hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <X aria-hidden className="h-4 w-4" />
                  </button>
                </div>
                <Radio
                  name="featured-upload"
                  value={String(index)}
                  label="대표"
                  checked={featured === index}
                  onChange={() => setFeatured(index)}
                  className="mt-2"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3 divide-y divide-line rounded-md border border-line bg-surface">
            {items.map((item, index) => (
              <div key={`${item.file.name}-${index}`} className="flex items-center justify-between gap-3 p-3 text-sm">
                <span className="flex min-w-0 items-center gap-2">
                  <FileText aria-hidden className="h-4 w-4 shrink-0 text-muted" />
                  <span className="truncate text-ink">{item.file.name}</span>
                  <span className="shrink-0 text-xs text-muted">{Math.ceil(item.file.size / 1024)}KB</span>
                </span>
                <button
                  type="button"
                  aria-label={`${item.file.name} 삭제`}
                  onClick={() => remove(index)}
                  className="flex h-7 w-7 items-center justify-center rounded-sm text-muted hover:bg-page hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <X aria-hidden className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )
      ) : null}
    </div>
  );
}
