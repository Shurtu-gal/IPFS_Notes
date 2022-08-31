# Vue.js and ipfs test project

Live demo available [here](https://fireworks-in-day.surge.sh/).

A simple markdown notepad in which you can share your notes with others and view notes posted by others securely.
 
## Todo:
- [x] Markdown rendering
- [x] Encrypt/Decrypt notes
- [x] LocalStorage management system for notes (no separate page for now. update note with epty text to delete)
- [x] Share notes (encrypts them with a password and proceeds to upload)
- [x] Upload to ipfs
~~- [ ] Notes view page (loads notes from ipfs CIDs shared by your friends)~~
- [x] fetching content from ipfs with CIDs
- [ ] actually loading the content as a note after decrypting it

This test project will be left in this state for now.

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
