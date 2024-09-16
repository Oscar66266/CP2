let handler = async (m, { conn, isRowner}) => {
let _muptime
let totalreg = Object.keys(global.db.data.users).length
let totalchats = Object.keys(global.db.data.chats).length
let pp = imagen1
if (process.send) {
process.send('uptime')
_muptime = await new Promise(resolve => {
process.once('message', resolve)
setTimeout(resolve, 1000)
}) * 1000
}
let muptime = clockString(_muptime)
const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
const groupsIn = chats.filter(([id]) => id.endsWith('@g.us')) 
const used = process.memoryUsage()
let yaemori = `🍩 ⋆ 🎀 𝔼𝕤𝕥𝕒𝕕𝕠 𝔻𝕖 𝔸𝕚 𝕐𝕦𝕜𝕚 🎀 ⋆ \n`
yaemori += `│ 🚩 *  ℂ𝕣𝕖𝕒𝕕𝕠𝕣   ∙* Kevs\n`
yaemori += `│ 📚 *  𝔾𝕣𝕦𝕡𝕠𝕤 𝕌𝕟𝕚𝕕𝕠𝕤 ∙* ${groupsIn.length}\n`
yaemori += `│ 👤 *  ℂ𝕙𝕒𝕥𝕤 ℙ𝕣𝕚𝕧𝕒𝕕𝕠𝕤 ∙* ${chats.length - groupsIn.length}\n`
yaemori += `│ 💬 *  𝕋𝕠𝕥𝕒𝕝 𝔻𝕖 ℂ𝕙𝕒𝕥𝕤 ∙* ${chats.length}\n`
yaemori += `│ 🫂 *  𝕌𝕤𝕦𝕒𝕣𝕚𝕠𝕤 ℝ𝕖𝕘𝕚𝕤𝕥𝕣𝕒𝕕𝕠𝕤 ∙* ${totalreg}\n`
yaemori += `│ 👥 *  𝔾𝕣𝕦𝕡𝕠𝕤 ℝ𝕖𝕘𝕚𝕤𝕥𝕣𝕒𝕕𝕠𝕤  ∙* ${totalchats}\n`
yaemori += `│ 🕜 *  𝔸𝕔𝕥𝕚𝕧𝕚𝕕𝕒𝕕 ∙* ${muptime}\n`
yaemori += `│ 🚩 Powered By Starlights Team`
await conn.sendFile(m.chat, pp, 'yaemori.jpg', yaemori, fkontak, null, rcanal)
}
handler.help = ['status']
handler.tags = ['info']
handler.command = ['estado', 'status', 'estate', 'state', 'stado', 'stats']
handler.register = true
export default handler

function clockString(ms) {
let h = Math.floor(ms / 3600000)
let m = Math.floor(ms / 60000) % 60
let s = Math.floor(ms / 1000) % 60
console.log({ms,h,m,s})
return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')}
