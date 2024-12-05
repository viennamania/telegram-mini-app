import { Composer, InlineKeyboard } from 'grammy'
import type { Context } from './context.js'
import { privateKeyToAccount } from 'thirdweb/wallets'
import { createThirdwebClient } from 'thirdweb'
import { config } from 'dotenv' 
import { set } from 'valibot'
config()

const composer = new Composer<Context>()

const feature = composer.chatType('private')

const adminAccount = privateKeyToAccount({
  privateKey: process.env.ADMIN_SECRET_KEY as string,
  client: createThirdwebClient({ clientId: process.env.THIRDWEB_CLIENT_ID as string }),
})

feature.command('start', async (ctx) => {

  console.log('start command')

  // bot me

  //const me = await ctx.get


  const username = ctx.from?.id+"";

  console.log('username', username)


  const expiration = Date.now() + 600_000; // valid for 10 minutes
  const message = JSON.stringify({
    username,
    expiration,
  });

  const authCode = await adminAccount.signMessage({
    message,
  });

  const url = `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}`

  //console.log('url', url)


  const keyboard = new InlineKeyboard().webApp(
    'OKX AI 에이전트 봇',
    url
  );
  
  
  return ctx.reply(
    '시작하기',
    { reply_markup: keyboard }
  )



})

export { composer as startFeature }
