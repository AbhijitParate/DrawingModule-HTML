/**
 * Created by abhij on 3/7/2017.
 */
// Attachments related
// let attachmentVideo;
// let attachmentAudio;
// let attachmentNotes;
// let attachmentFiles;
let attachments = [];
let attachmentId = 0;
function Attachment(name, type, data) {
    this.id = attachmentId++;
    this.name = name;
    this.type = type;
    this.data = data;
}