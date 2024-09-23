const {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion, 
    MessageRetryMap,
    makeCacheableSignalKeyStore, 
    jidNormalizedUser,
    PHONENUMBER_MCC
} = await import('@whiskeysockets/baileys')
import moment from 'moment-timezone'
import NodeCache from 'node-cache'
import readline from 'readline'
import qrcode from "qrcode"
import crypto from 'crypto'
import fs from "fs"
import pino from 'pino';
import * as ws from 'ws';
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js';

if (global.conns instanceof Array) console.log()
else global.conns = []

let handler = async (m, { conn: star, args, usedPrefix, command, isROwner }) => {

  async function serbot() {
    let authFolderB = m.sender.split('@')[0]

    if (!fs.existsSync("./serbot/"+ authFolderB)){
        fs.mkdirSync("./serbot/"+ authFolderB, { recursive: true });
    }
    args[0] ? fs.writeFileSync("./serbot/" + authFolderB + "/creds.json", JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
    
    const {state, saveState, saveCreds} = await useMultiFileAuthState(`./serbot/${authFolderB}`)
    const msgRetryCounterMap = (MessageRetryMap) => { };
    const msgRetryCounterCache = new NodeCache()
    const {version} = await fetchLatestBaileysVersion();
    let phoneNumber = m.sender.split('@')[0]

    const methodCodeQR = process.argv.includes("qr")
    const methodCode = !!phoneNumber || process.argv.includes("code")
    const MethodMobile = process.argv.includes("mobile")

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))

    const connectionOptions = {
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      mobile: MethodMobile, 
      browser: [ "Ubuntu", "Chrome", "20.0.04"], 
      auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
      },
      markOnlineOnConnect: true, 
      generateHighQualityLinkPreview: true, 
      getMessage: async (clave) => {
      let jid = jidNormalizedUser(clave.remoteJid)
      let msg = await store.loadMessage(jid, clave.id)
      return msg?.message || ""
      },
      msgRetryCounterCache,
      msgRetryCounterMap,
      defaultQueryTimeoutMs: undefined,   
      version
    }

    let conn = makeWASocket(connectionOptions)

    if (methodCode && !conn.authState.creds.registered) {
        if (!phoneNumber) {
            process.exit(0);
        }
        let cleanedNumber = phoneNumber.replace(/[^0-9]/g, '');
        if (!Object.keys(PHONENUMBER_MCC).some(v => cleanedNumber.startsWith(v))) {
            process.exit(0);
        }

        setTimeout(async () => {
            let codeBot = await conn.requestPairingCode(cleanedNumber);
            codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot;
            let txt = '`–  S E R B O T  -  S U B B O T`\n\n'
                txt += `┌  ✩  *Usa este Código para convertirte en un Sub Bot*\n`
                txt += `│  ✩  Pasos\n`
                txt += `│  ✩  *1* : Haga click en los 3 puntos\n`
                txt += `│  ✩  *2* : Toque dispositivos vinculados\n`
                txt += `│  ✩  *3* : Selecciona *Vincular con el número de teléfono*\n` 
                txt += `└  ✩  *4* : Escriba el Codigo\n\n`
                txt += `> *Nota:* Este Código solo funciona en el número que lo solicito`
            let pp = 'https://telegra.ph/file/6b6ded4f12b865c7bf0cf.mp4'
            let sendTxt = await star.reply(m.chat, txt, m, rcanal)
            let sendCode = await star.reply(m.chat, codeBot, m, rcanal)
        
       setTimeout(() => {
         star.sendMessage(m.chat, { delete: sendTxt })
         star.sendMessage(m.chat, { delete: sendCode })
       }, 30000)
            rl.close()
        }, 3000)
    }

    conn.isInit = false

    let isInit = true

    async function connectionUpdate(update) {
        const { connection, lastDisconnect, isNewLogin, qr } = update
        if (isNewLogin) conn.isInit = true

        const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
        if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
            let i = global.conns.indexOf(conn)
            if (i < 0) return console.log(await creloadHandler(true).catch(console.error))
            delete global.conns[i]
            global.conns.splice(i, 1)
        }

        if (global.db.data == null) loadDatabase()

        if (connection == 'open') {
            conn.isInit = true
            global.conns.push(conn)
            await star.reply(m.chat, `Conectado exitosamente con WhatsApp.\n\n*Nota:* Esta conexión de Sub-Bot aun esta en fase de prueba, por lo que puede que tenga algunos errores pero que con el tiempo se solucionaran.\n\n*Canal:*\n*-* https://whatsapp.com/channel/0029VaBfsIwGk1FyaqFcK91S`, m, rcanal)
            /*let res = await conn.groupAcceptInvite(`HxDXLj3gVld3B6wxoNsP9G`)
            await sleep(5000)
            if (args[0]) return*/
            //star.sendMessage(conn.user.jid, {text : usedPrefix + command + " " + Buffer.from(fs.readFileSync("./serbot/" + authFolderB + "/creds.json"), "utf-8").toString("base64")}, { quoted: m })
        }
    }

    const timeoutId = setTimeout(() => {
        if (!conn.user) {
            try {
                conn.ws.close()
            } catch {}
            conn.ev.removeAllListeners()
            let i = global.conns.indexOf(conn)
            if (i >= 0) {
                delete global.conns[i]
                global.conns.splice(i, 1)
            }
            fs.rmdirSync(`./serbot/${authFolderB}`, { recursive: true })
        }
    }, 30000)

    conn.ev.on('connection.update', connectionUpdate)

    let handler = await import('../handler.js')
    let creloadHandler = async function (restatConn) {
        try {
            const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
            if (Object.keys(Handler || {}).length) handler = Handler
        } catch (e) {
            console.error(e)
        }
        if (restatConn) {
            try { conn.ws.close() } catch { }
            conn.ev.removeAllListeners()
            conn = makeWASocket(connectionOptions)
            isInit = true
        }

        if (!isInit) {
            conn.ev.off("messages.upsert", conn.handler)
            conn.ev.off("connection.update", conn.connectionUpdate)
            conn.ev.off('creds.update', conn.credsUpdate)
        }
        conn.handler = handler.handler.bind(conn)
        conn.connectionUpdate = connectionUpdate.bind(conn)
        conn.credsUpdate = saveCreds.bind(conn, true)

        conn.ev.on("messages.upsert", conn.handler)
        conn.ev.on("connection.update", conn.connectionUpdate)
        conn.ev.on("creds.update", conn.credsUpdate)
        isInit = false
        return true
    }
    creloadHandler(false)
  }
  serbot() 
}
handler.help = ['serbot']
handler.tags = ['serbot']
handler.command = ['code', 'codebot', 'serbot', 'jadibot']
handler.rowner = false

export default handler

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
