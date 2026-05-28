# Cloudinary file storage

Uploaded files are stored in [Cloudinary](https://cloudinary.com) instead of the local `uploads/` folder.

## Setup

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. From the [Dashboard](https://console.cloudinary.com/), copy:
   - **Cloud name**
   - **API Key**
   - **API Secret**
3. Add to `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=converse-documents
```

4. Restart the backend: `pnpm start:dev` (from `backend/`).

## Upload flow

1. Client sends `POST /upload/file` with `multipart/form-data` field `file`.
2. Multer reads the file into memory (no disk write).
3. `CloudinaryService` uploads the buffer to your Cloudinary folder.
4. PDFs are processed for RAG from the in-memory buffer; the Cloudinary URL is logged for reference.

## Response example

```json
{
  "success": true,
  "message": "File stored in Cloudinary. Document processing has started.",
  "file": {
    "publicId": "converse-documents/report_1716900000000",
    "url": "https://res.cloudinary.com/...",
    "format": "pdf",
    "bytes": 123456
  }
}
```

## Notes

- Max upload size: **10MB** per file (adjust in `upload.module.ts` if your plan allows more).
- PDFs use Cloudinary `raw` resource type; images use `auto`.
- Only PDFs trigger the embedding pipeline; images are stored only.
