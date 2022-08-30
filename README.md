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
Notes will be stored in plaintext in localstorage.

```
allNotes = {
    {
        local_id: "unique sha16 hash",

        created_on: date and time,
        last_modified: date and time,

        shared: {
            state: boolean (default false, meaning not shared),
            sharedID: unique ID in sharedNotes obj
        },

        note_title: "first line by default",
        note_content: "markdown text string"
    },

    ... goes on for all notes.
}
```

```
sharedNotes = {
    {
        local_id: "unique sha16 hash",
        cid: "ipfs content id",

        shared_on: date and time,

        key: "password string to decrypt it" (maybe encrypt these w/ a master password?),
        content: local copy of encrypted content
    },

    ... goes on for *all instances of* shared content
}
```