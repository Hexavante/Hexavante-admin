"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { updateProfileBannerAction, removeProfileBannerAction } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

type Props = {
  currentBanner?: string | null;
};

export function ProfileBannerUpload({ currentBanner }: Props) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const preview = localPreview ?? currentBanner ?? null;
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    const isAllowedType =
      ALLOWED_TYPES.includes(file.type) || /\.(jpe?g|png|gif|webp)$/i.test(file.name);

    if (!isAllowedType) {
      setError("Use uma imagem PNG, JPG, GIF ou WebP.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("A imagem deve ter no máximo 8MB.");
      return;
    }

    const previousPreview = localPreview;
    const reader = new FileReader();
    reader.onload = (event) => setLocalPreview(event.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await updateProfileBannerAction(formData);
      if (!result.success) {
        setError(result.error || "Erro ao enviar banner.");
        setLocalPreview(previousPreview);
        return;
      }

      router.refresh();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Erro ao enviar banner.",
      );
      setLocalPreview(previousPreview);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }, [localPreview, router]);

  const handleRemove = useCallback(async () => {
    setError(null);
    setUploading(true);
    try {
      const result = await removeProfileBannerAction();
      if (!result.success) {
        setError(result.error || "Erro ao remover banner.");
        return;
      }
      setLocalPreview(null);
      router.refresh();
    } catch {
      setError("Erro ao remover banner.");
    } finally {
      setUploading(false);
    }
  }, [router]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        variant="outline"
        className="text-sm"
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <ImagePlus className="h-4 w-4 mr-2" />
        )}
        {preview ? "Alterar banner" : "Adicionar banner"}
      </Button>

      {preview && !uploading && (
        <Button
          type="button"
          onClick={handleRemove}
          variant="outline"
          className="text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Remover banner
        </Button>
      )}

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      <p className="w-full text-xs text-slate-500">PNG, JPG, GIF ou WebP (máx. 8MB). Proporção recomendada: 1200x400.</p>
    </div>
  );
}
