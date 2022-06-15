/**
 * @typedef {import('telegraf/typings/context').TelegrafContext} TelegrafContext
 */

/**
 *
 * @param {TelegrafContext} ctx Telegraf Context
 */
export async function handleTestCommand(ctx) {
  const COMMAND = '/test'
  const { message } = ctx

  const reply = 'Hello there from another file! Awaiting your service'

  const didReply = await ctx.reply(reply, {
    reply_to_message_id: message?.message_id
  })

  if (didReply) {
    console.log(`Reply to ${COMMAND} command sent successfully.`)
  } else {
    console.error(
      `Something went wrong with the ${COMMAND} command. Reply not sent.`
    )
  }
}

/**
 *
 * @param {TelegrafContext} ctx Telegraf Context
 */
export async function handleOnMessage(ctx) {
  const { message } = ctx

  const isGroup =
    message?.chat.type === 'group' || message?.chat.type === 'supergroup'

  if (isGroup) {
    await ctx.reply('This bot is only available in private chats.')
    return
  }

  const reply = 'a message was sent'

  await ctx.reply(reply, {
    reply_to_message_id: message.message_id
  })
}
