import Calendar from 'telegraf-calendar-telegram'

export const setup = (bot) => {
  const calendar = new Calendar(bot, {
    startWeekDay: 1,
    weekDayNames: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    monthNames: [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ]
  })

  calendar.setDateListener((ctx, date) => {
    ctx.reply(`📅 Réservé pour le ${date}`)
  })

  bot.command('calendar', async (ctx) => {
    const today = new Date()
    const minDate = new Date()
    minDate.setMonth(today.getMonth() - 2)
    const maxDate = new Date()
    maxDate.setMonth(today.getMonth() + 2)
    maxDate.setDate(today.getDate())

    await ctx.reply(
      'Calendrier :',
      calendar.setMinDate(minDate).setMaxDate(maxDate).getCalendar()
    )
  })

  bot.catch((err) => {
    console.error('Error in bot:', err)
  })
}
