import mongoose from 'mongoose';
const AttachmentSchema = new mongoose.Schema({
  diaryEntryId: { type: mongoose.Schema.Types.ObjectId, ref: 'DiaryEntries', required: true },
  filename: { type: String, required: true },
  fileType: { type: String },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const Attachment = mongoose.model('Attachments', AttachmentSchema);
export default Attachment;
