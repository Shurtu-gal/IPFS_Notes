
var md = new Remarkable()

let app = Vue.createApp({
    data() {
        return {
            guide: `Welcome to IPFS pad - a note taking and sharing application that uses the decentralised IPFS system to store your content.
            \nTry writing markdown here, and see it being rendered live below!
            \n\nThis text will disappear once you start typing.`,

            // "page" control variable. Not using vue routers to reduce complexity since there won't be many pages
            showPage: "main", // can take values: main [x], share [], open []
            
            // show rules for individual components
            showMarkdownRender: true,

            display_md_section: (this.showPage === 0) && showMarkdownRender,

            // vars used by the encryption/decryption process
            plainText: "",
            loadedFromStorageID: "" // tracks ID of note loaded from storage
        };
    },

    methods: {
        encryptData(plaintext, password) { // encrypts {plaintext} with a password it prompts for. returns string representation of encrypted data. Pass in {password} as empty string for prompt.
            if (plaintext.length !== 0) {
                if (password.length === 0) {
                    const password = prompt("enter a password (16 chr random string by default)", CryptoJS.lib.WordArray.random(16))
                }

                const salt = CryptoJS.lib.WordArray.random(16)
                const iv = CryptoJS.lib.WordArray.random(16)

                const key = CryptoJS.PBKDF2(password, salt, { keySize: 256/32, iterations: 10000, hasher: CryptoJS.algo.SHA256})

                const encrypted = CryptoJS.AES.encrypt(plaintext, key, {iv: iv}).ciphertext

                const concatenned =  CryptoJS.lib.WordArray.create().concat(salt).concat(iv).concat(encrypted)

                const encryptedObj = {
                    iv: iv.toString(CryptoJS.enc.Base64),
                    salt: salt.toString(CryptoJS.enc.Base64),
                    encrypted: encrypted.toString(CryptoJS.enc.Base64),
                    concatenned: concatenned.toString(CryptoJS.enc.Base64)
                }

                return encryptedObj.concatenned

            } else {
                alert("no text entered")
            }
        },

        decryptData(data, password) {
            if (password.length === 0) {
                const password = prompt("enter the password", "")
            }

            const encrypted =  CryptoJS.enc.Base64.parse( data )

            const salt_len = iv_len = 16

            const salt = CryptoJS.lib.WordArray.create(
                encrypted.words.slice(0, salt_len / 4 )
            );
            
            const iv = CryptoJS.lib.WordArray.create(
                encrypted.words.slice(0 + salt_len / 4, (salt_len+iv_len) / 4 )
            );

            const key = CryptoJS.PBKDF2(
                password,
                salt,
                { keySize: 256/32, iterations: 10000, hasher: CryptoJS.algo.SHA256}
            );

            const decrypted = CryptoJS.AES.decrypt(
                {
                    ciphertext: CryptoJS.lib.WordArray.create(
                        encrypted.words.slice((salt_len + iv_len) / 4)
                    )
                },
                key,
                {iv: iv}
            );

            return decrypted.toString(CryptoJS.enc.Utf8)
        },

        deleteData() {
        },
    
        shareFlow() { // sequence executed for sharing a note
            let ciphertext = this.encryptData(this.plainText, "");
            //c onsole.log(ciphertext)

            // upload to ipfs

            let plaintextAgain = this.decryptData(ciphertext, ""); // just for testing purpose. this will be used in a separate page
            // console.log(plaintextAgain)
        },

        loadNote() {
            if ((this.plainText.length === 0) && (this.loadedFromStorageID.length === 0)) { // if markdown input empty and nothing loaded
                const nid = prompt("enter id of note to load", '')
                this.loadedFromStorageID = nid

                var temp = JSON.parse(localStorage.getItem(nid))

                this.plainText = temp.content

                console.log("loaded an item from local storage")

            } else {
                alert("please save your current work first")
            }

        },

        saveNote() { // save the contents of this.plainText to local storage. update if content was loaded from storage
            if (this.plainText.length !== 0) {
                // appendToNotesStorage(this.plainText)
                const today = new Date().toLocaleString() // current date and time
                const local_id = CryptoJS.lib.WordArray.random(20).toString() // generating a random ID

                // const shared = {
                //     state: false, // change to true if shared to ipfs
                //     cid: // ipfs cid if shared
                //     password: // password to decrypt the contents retrieved from cid
                // },
                
                if (this.loadedFromStorageID.length !== 0) { // if note was loaded from storage, just update last modified and content

                    let temp = JSON.parse(localStorage.getItem(this.loadedFromStorageID))
                    localStorage.removeItem(this.loadedFromStorageID)

                    temp.last_modified = new Date().toLocaleString()
                    temp.title = this.plainText.split('\n')[0]
                    temp.content = this.plainText

                    localStorage.setItem(this.loadedFromStorageID, JSON.stringify(temp))
                    this.loadedFromStorageID = ""
                    
                    console.log("updated an item in Local Storage")
                    console.log(temp)
                    
                } else { // creating an entirely new notes object

                    var noteObj = {
                        type: "note",
                        created_on: new Date().toLocaleString(),
                        last_modified: new Date().toLocaleString(),
                        title: this.plainText.split('\n')[0],
                        content: this.plainText
                    }

                    localStorage.setItem(local_id, JSON.stringify(noteObj))

                    console.log("saved a new item to Local Storage")
                    console.log(noteObj)
                }

            } else {
                alert("nothing to save")
            }
        },

    },

    computed: {
        renderedHTML() {
            if (this.showMarkdownRender && (this.showPage === "main")) {
                return md.render(this.plainText)
            }
        }
    },

    mounted() {
        // code to run after initialization
        

    },
})

app.mount('#app')