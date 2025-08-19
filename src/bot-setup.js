import Calendar from 'telegraf-calendar-telegram'

/**
 * @typedef {import('telegraf/typings/context').TelegrafContext} TelegrafContext
 * @typedef {import('telegraf/typings/telegraf').Telegraf<TelegrafContext>} Telegraf
 */

/**
 * Setup how the bot handles user interactions
 * @param {Telegraf} bot Bot to setup
 */
export const setup = (bot) => {
  // instantiate the calendar
  const calendar = new Calendar(bot, {
    startWeekDay: 1,
    weekDayNames: ['L', 'M', 'M', 'J', 'V', 'S', 'D']
  })

  // listen for the selected date event
  calendar.setDateListener((context, date) => context.reply(date))
  // retrieve the calendar HTML
  bot.command('calendar', async (ctx) => {
    const today = new Date()
    const minDate = new Date()
    minDate.setMonth(today.getMonth() - 2)
    const maxDate = new Date()
    maxDate.setMonth(today.getMonth() + 2)
    maxDate.setDate(today.getDate())

    const didReply = await ctx.reply(
      'Here you are',
      calendar.setMinDate(minDate).setMaxDate(maxDate).getCalendar()
    )

    if (didReply) {
      console.log('Reply to /calendar command sent successfully.')
    } else {
      console.error(
        'Something went wrong with the /calendar command. Reply not sent.'
      )
    }
  })

  bot.catch((err) => {
    console.error('Error in bot:', err)
  })
}
