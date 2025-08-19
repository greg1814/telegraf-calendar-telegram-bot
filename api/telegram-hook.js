import { Telegraf } from 'telegraf'

import { setup } from '../src/bot-setup'

/**
 * @typedef {import('@vercel/node').VercelRequest} VercelRequest
 * @typedef {import('@vercel/node').VercelResponse} VercelResponse
 */

export const BOT_TOKEN = process.env.BOT_TOKEN
if (!BOT_TOKEN) {
  throw new Error(
    'bot token required - please set BOT_TOKEN environment variable'
  )
}

const SECRET_HASH = process.env.SECRET_HASH
if (!SECRET_HASH) {
  throw new Error(
    'secret hash required - please set SECRET_HASH environment variable'
  )
}

// Note: change to false when running locally
const BASE_PATH =
  'https://telegraf-calendar-telegram-bot-gianlucaparadise.vercel.app'
const bot = new Telegraf(BOT_TOKEN)

setup(bot)

/**
 * @param {VercelRequest} req
 * @param {VercelResponse} res
 */
export default async (req, res) => {
  try {
    // Retrieve the POST request body that gets sent from Telegram
    res.status(200).send('OK')
    const { body, query } = req

    if (query.setWebhook === 'true') {
      const webhookUrl = `${BASE_PATH}/api/telegram-hook?secret_hash=${SECRET_HASH}`

      // Would be nice to somehow do this in a build file or something
      const isSet = await bot.telegram.setWebhook(webhookUrl)
      console.log(`Set webhook to ${webhookUrl}: ${isSet}`)
    }

    const update = req.body; // Telegram envoie du JSON
    console.log("Telegram update:", update);

    // Exemple : si le message est "/calendar"
    if (update.message?.text === "/calendar") {
      // TODO: ta logique (répondre, etc.)
      return res.status(200).json({ ok: true, action: "calendar" });
    }

    // Sinon juste ack
    return res.status(200).json({ ok: true });
  } catch (error) {
    // If there was an error sending our message then we
    // can log it into the Vercel console
    console.error('Error sending message', error)
    console.log('webhook called with body', req?.body)
  }

  // Acknowledge the message with Telegram
  // by sending a 200 HTTP status code
  // The message here doesn't matter.
  res.status(200).send('OK')
}
