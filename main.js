var md = new Remarkable()

let app = Vue.createApp({
    data() {
        return {
            guide: `Welcome to IPFS pad - a note taking and sharing application that uses the decentralised IPFS system to store your content.
            \nTry writing markdown here, and see it being rendered live below!
            \n\nThis text will disappear once you start typing.`,

            // "page" control variable. Not using vue routers to reduce complexity since there won't be many pages
            showPage: "main", // can take values: main, share, open, settings
            
            // show rules for individual components
            showMarkdownRender: true,

            display_md_section: (this.showPage === 0) && showMarkdownRender,

            // vars used by the encryption/decryption process
            plainText: "",
            password: "",
            encryptedObj: {},

            decryptedObj: {
                text: ""
            }
        };
    },

    methods: {
        encryptData() {
            if (this.plainText.length !== 0) {
                this.password = prompt("enter a password (16 chr random string by default)", CryptoJS.lib.WordArray.random(16))
                // // hash the name with any algorithm
                // const data = CryptoJS.AES.encrypt(this.plaintext, this.secret).toString();

                // // store into localStorage
                // localStorage.setItem("secretData", data);

                // // display the encrypted data
                // this.getEncryptedData();

                const salt = CryptoJS.lib.WordArray.random(16)
                const iv = CryptoJS.lib.WordArray.random(16)

                const key = CryptoJS.PBKDF2(this.password, salt, { keySize: 256/32, iterations: 10000, hasher: CryptoJS.algo.SHA256})

                const encrypted = CryptoJS.AES.encrypt(this.plainText, key, {iv: iv}).ciphertext

                const concatenned =  CryptoJS.lib.WordArray.create().concat(salt).concat(iv).concat(encrypted)

                this.encryptedObj = {
                    iv: iv.toString(CryptoJS.enc.Base64),
                    salt: salt.toString(CryptoJS.enc.Base64),
                    encrypted: encrypted.toString(CryptoJS.enc.Base64),
                    concatenned: concatenned.toString(CryptoJS.enc.Base64)
                }

                console.log(this.encryptedObj)
                this.password = '' // clearing the password variable
            } else {
                alert("no text entered")
            }
        },

        decryptData() {
            this.password = prompt("enter the password", "")
            // // get data from localStorage
            // const secretData = localStorage.getItem("secretData");

            // // decrypt the data and convert to string
            // const decryptData = CryptoJS.AES.decrypt(
            //     secretData,
            //     this.secret
            // );//.toString(CryptoJS.enc.Utf8);

            // localStorage.setItem("dData", decryptData);

            // alert("Decrypted private data: " + decryptData);

            const encrypted =  CryptoJS.enc.Base64.parse(this.encryptedObj.concatenned)

            const salt_len = iv_len = 16

            const salt = CryptoJS.lib.WordArray.create(
                encrypted.words.slice(0, salt_len / 4 )
            );
            
            const iv = CryptoJS.lib.WordArray.create(
                encrypted.words.slice(0 + salt_len / 4, (salt_len+iv_len) / 4 )
            );

            const key = CryptoJS.PBKDF2(
                this.password,
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

            this.decryptedObj.text = decrypted.toString(CryptoJS.enc.Utf8)
            console.log(this.decryptedObj.text)

            this.password = '' // clearing password variable
        },

        deleteData() {
        },
    
        shareFlow() {
            this.encryptData();

            // upload to ipfs

            this.decryptData(); // just for testing purpose. this will be used in a separate page
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