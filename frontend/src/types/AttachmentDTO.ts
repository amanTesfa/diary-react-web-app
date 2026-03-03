export interface AttachmentDTO {
    _id: string;
  diaryEntryId: string;
  userId: string;
  filename: string;
  fileType?: string;
  fileUrl: string;
  uploadedAt?: string;
}
