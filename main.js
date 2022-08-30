var md = new Remarkable()

let app = Vue.createApp({
    data() {
        return {
            guide: `Welcome to IPFS pad - a note taking and sharing application that uses the decentralised IPFS system to store your content.
            \nTry writing markdown here, and see it being rendered live below!
            \n\nThis text will disappear once you start typing.`,

            // "page" control variable. Not using vue routers to reduce complexity since there won't be many pages
            showPage: "main", // can take values: main, share (optional), open, settings, manage
            
            // show rules for individual components
            showMarkdownRender: true,

            display_md_section: (this.showPage === 0) && showMarkdownRender,

            // vars used by the encryption/decryption process
            plainText: "",
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
        }
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