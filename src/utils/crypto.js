import CryptoJS from 'crypto-js'


function encrypt(message, key) {
    const keyBytes = CryptoJS.enc.Utf8.parse(key)

    const encrypted = CryptoJS.AES.encrypt(message, keyBytes, {
        iv: CryptoJS.lib.WordArray.create(0),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        keySize: 256 / 32,
        blockSize: 128 / 32
    })

    return encrypted.toString()
}

export { encrypt }