/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLOUDINARY_upload_preset: string;
  readonly VITE_CLOUDINARY_cloud_name: string;
  readonly VITE_CLOUDINARY_url: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
