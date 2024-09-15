import {WAMessageStubType} from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, {conn, participants, groupMetadata}) {
  if (!m.messageStubType || !m.isGroup) return !0;
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://tinyurl.com/298ubhqf')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]

  if (chat.welcome && m.messageStubType == 27) {
    let wel = `Hola @${m.messageStubParameters[0].split`@`[0]} Bienvenido Al grupo\n${groupMetadata.subject}\n`
await conn.sendMini(m.chat, packname, dev, wel, img, img, channel)
  }

  if (chat.welcome && m.messageStubType == 28) {
   let bye = `𝗔𝗗𝗜𝗢𝗦 👋 @${m.messageStubParameters[0].split`@`[0]}`
await conn.sendMini(m.chat, packname, dev, bye, img, img, channel)
  }

  if (chat.welcome && m.messageStubType == 32) {
    let kick = `𝗔𝗗𝗜𝗢𝗦  👋 @${m.messageStubParameters[0].split`@`[0]}`
await conn.sendMini(m.chat, packname, dev, kick, img, img, channel)
}}

/*import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true;

  let vn = 'https://qu.ax/cUYg.mp3';
  let vn2 = 'https://qu.ax/cTDa.mp3';
  let welc = welcome;
  let adi = adios;
  let chat = global.db.data.chats[m.chat];
  const getMentionedJid = () => {
    return m.messageStubParameters.map(param => `${param}@s.whatsapp.net`);
  };

  let who = m.messageStubParameters[0] + '@s.whatsapp.net';
  let user = global.db.data.users[who];

  let userName = user ? user.name : await conn.getName(who);

  if (chat.welcome && m.messageStubType === 27) {
    this.sendMessage(m.chat, {
      audio: { url: vn },
      contextInfo: {
        mentionedJid: getMentionedJid(),
        "externalAdReply": {
          "thumbnail": welc,
          "title": "  ͟͞ Ｗ Ｅ Ｌ Ｃ Ｏ Ｍ Ｅ ͟͞  ",
          "body": `${userName}!`,
          "previewType": "PHOTO",
          "thumbnailUrl": null,
          "showAdAttribution": true,
          sourceUrl: [yt, md, channel].sort(() => 0.5 - Math.random())[0]
        }
      },
      ptt: true,
      mimetype: 'audio/mpeg',
      fileName: 'welcome.mp3'
    }, { quoted: fkontak });
  }

  if (chat.welcome && (m.messageStubType === 28 || m.messageStubType === 32)) {
    this.sendMessage(m.chat, {
      audio: { url: vn2 },
      contextInfo: {
        mentionedJid: getMentionedJid(),
        "externalAdReply": {
          "showAdAttribution": true,
          "containsAutoReply": true,
          "title": '  ͟͞ Ａ Ｄ Ｉ Ｏ́ Ｓ ͟͞  ',
          body: `${userName}, se despide.`,
          "previewType": "PHOTO",
          "thumbnailUrl": '',
          "thumbnail": adi,
          "sourceUrl": redes
        }
      }
    }, { quoted: fkontak });
  }
}*/
