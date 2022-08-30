# Vue.js and ipfs test project

Live demo available [here](https://fireworks-in-day.surge.sh/).

A simple markdown notepad in which you can share your notes with others and view notes posted by others securely.
 
## Todo:
- [x] Markdown rendering
- [x] Encrypt/Decrypt notes
- [ ] LocalStorage management system for notes (page yet to be implemented)
- [ ] Share notes (encrypts them with a password and proceeds to upload)
- [ ] Upload to ipfs
- [ ] Notes view page. (loads notes from ipfs CIDs and passwords shared by your friends)

## Ideas
For simplicity, notes are stored in Local Storage in this manner:

```
unique_id: {
    type: "local" for local notes, "ipfs" for content you have made available on ipfs

    created_on: date and time,
    last_modified: date and time,

    title: first line of content,
    content: content string
},

... goes on for all notes.

```
