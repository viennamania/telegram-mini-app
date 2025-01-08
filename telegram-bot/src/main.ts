#!/usr/bin/env tsx

import process from 'node:process'
import { ValiError, flatten } from 'valibot'
import { type RunnerHandle, run } from '@grammyjs/runner'
import { createLogger } from './logger.js'
import { createBot } from './bot/index.js'
import type { PollingConfig, WebhookConfig } from './config.js'
import { createConfig } from './config.js'
import { createServer, createServerManager } from './server/index.js'
import type { Bot } from './bot/index.js'


// Handler for serverless environments
let botInstance: Bot | null = null;



async function startPolling(config: PollingConfig) {
  const logger = createLogger(config)
  
  const bot = createBot(config.botToken, {
    config,
    logger,
  })

  const me = await bot.api.getMe();



  bot.api.setMyCommands([
    { command: "start", description: "시작하기" },
  ])




  botInstance = bot


  

  let runner: undefined | RunnerHandle

  // graceful shutdown
  onShutdown(async () => {
    logger.info('Shutdown')
    await runner?.stop()
  })

  await bot.init()

  // start bot
  runner = run(bot, {
    runner: {
      fetch: {
        allowed_updates: config.botAllowedUpdates,
      },
    },
  })

  logger.info({
    msg: 'Bot running.......',
    username: bot.botInfo.username,

  })
}



async function startWebhook(config: WebhookConfig) {
  const logger = createLogger(config)
  const bot = createBot(config.botToken, {
    config,
    logger,
  })
  const server = createServer({
    bot,
    config,
    logger,
  })
  const serverManager = createServerManager(server, {
    host: config.serverHost,
    port: config.serverPort,
  })

  // graceful shutdown
  onShutdown(async () => {
    logger.info('Shutdown')
    await serverManager.stop()
  })

  // to prevent receiving updates before the bot is ready
  await bot.init()

  // start server
  const info = await serverManager.start()
  logger.info({
    msg: 'Server started',
    url: info.url,
  })

  // set webhook
  await bot.api.setWebhook(config.botWebhook, {
    allowed_updates: config.botAllowedUpdates,
    secret_token: config.botWebhookSecret,
  })
  logger.info({
    msg: 'Webhook was set',
    url: config.botWebhook,
  })
}

// Utils

function onShutdown(cleanUp: () => Promise<void>) {
  let isShuttingDown = false
  const handleShutdown = async () => {
    if (isShuttingDown)
      return
    isShuttingDown = true
    await cleanUp()
  }
  process.on('SIGINT', handleShutdown)
  process.on('SIGTERM', handleShutdown)
}


type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
  : Lowercase<S>

type KeysToCamelCase<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K] extends object ? KeysToCamelCase<T[K]> : T[K]
}

function toCamelCase(str: string): string {
  return str.toLowerCase().replace(/_([a-z])/g, (_match, p1) => p1.toUpperCase())
}

function convertKeysToCamelCase<T>(obj: T): KeysToCamelCase<T> {
  const result: any = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelCaseKey = toCamelCase(key)
      result[camelCaseKey] = obj[key]
    }
  }
  return result
}




async function startBot() {
  try {

    try {
      process.loadEnvFile()
    }
    catch {
      // No .env file found
    }

    // @ts-expect-error create config from environment variables
    const config = createConfig(convertKeysToCamelCase(process.env))

    if (config.isWebhookMode)
      await startWebhook(config)
    else if (config.isPollingMode)
      await startPolling(config)

  }
  catch (error) {
    if (error instanceof ValiError) {
      console.error('Config parsing error', flatten(error.issues))
    }
    else {
      console.error(error)
    }
    process.exit(1)
  }
}





export default async function handler(req: any, res: any) {
  try {
    process.loadEnvFile()
  } catch {
    // No .env file found
  }

  // @ts-expect-error create config from environment variables
  const config = createConfig(convertKeysToCamelCase(process.env))

  if (config.isWebhookMode) {
    const logger = createLogger(config)
    const bot = createBot(config.botToken, { config, logger })
    await bot.init()
    
    const server = createServer({ bot, config, logger })
    await server.fetch(req)
    
    res.status(200).send('OK')

  } else if (config.isPollingMode) {
    if (!botInstance) {
      const logger = createLogger(config)
      botInstance = createBot(config.botToken, { config, logger })
      await botInstance.init()
      // Start the bot in polling mode without awaiting
      startPolling(config).catch(error => {
        console.error('Error in polling mode:', error)
      })
    }
    res.status(200).send('Bot is running in polling mode')

  } else {
    res.status(400).send('Invalid bot configuration')
  }
}

// Check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startBot()
}


console.log('Hello, world!')





// fetch account data from the server

async function fetchAccountData() {

  if (botInstance) {

    const center = botInstance.botInfo.username;

    const response = await fetch("https://owinwallet.com/api/agent/getApplicationsForCenter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress: '0x',
        center,
      }),
    });
    
    if (response.status !== 200) {
      ///return ctx.reply("Failed to get leaderboard");
      return;
    }


    const data = await response.json();

    const applications = data.result.applications;

    const totalAccountCount = data.result.totalCount;
      
    const totalTradingAccountBalance = '$' + Number(data.result.totalTradingAccountBalance).toFixed(2);


    const url = `${process.env.FRONTEND_APP_ORIGIN}/api/user/getAllUsersTelegramIdByCenter`;

    const responseUsers = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        center,
      }),
    });

    if (responseUsers.status !== 200) {
      ///return ctx.reply("Failed to get leaderboard");
      return;
    }

    const dataUsers = await responseUsers.json();
    
    for (const user of dataUsers.result) {
      const telegramId = user.telegramId;

      if (!telegramId) {
        continue;
      }

      // find application for the user by wallet address

      const application = applications.find((application: any) => application.walletAddress === user.walletAddress);


      const masterBotImageUrl = application ? application?.masterBotInfo?.imageUrl : '';

      const tradingAccountBalance = application ? '$' + Number(application.tradingAccountBalance.balance).toFixed(2) : 'N/A';


      if (masterBotImageUrl) {

        try {
          botInstance.api.sendPhoto(
            telegramId,
            masterBotImageUrl,
            {
              caption: '🔥 My Trading Account Balance: ' + tradingAccountBalance + '\n'
              //+ '💪 Total Account Count: ' + totalAccountCount + '\n'
              //+ '🔥 Total Trading Account Balance: ' + totalTradingAccountBalance
            }
          )
        } catch (error) {
          console.error('Error sending photo:', error)
        }

      } else {

        try {
      
          botInstance.api.sendMessage(
            telegramId,
            // emoji: https://emojipedia.org/
            '🔥 My Trading Account Balance: ' + tradingAccountBalance + '\n'
            //+ '💪 Total Account Count: ' + totalAccountCount + '\n'
            //+ '🔥 Total Trading Account Balance: ' + totalTradingAccountBalance
          )

        } catch (error) {
          //console.error('Error sending message:', error)
        }

      }
      
      

    }


    

  }
  
}


// sleep for 5 seconds
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// fetch account data after 5 seconds

sleep(5000).then(() => {
  fetchAccountData()
})



// fetch account data every 3600 seconds
setInterval(() => {

    fetchAccountData()
    

}, 3600*1000)