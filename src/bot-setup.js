import Calendar from 'telegraf-calendar-telegram'
import { createClient } from '@supabase/supabase-js'

/**
 * @typedef {import('telegraf/typings/context').TelegrafContext} TelegrafContext
 * @typedef {import('telegraf/typings/telegraf').Telegraf<TelegrafContext>} Telegraf
 */

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

/**
 * Setup how the bot handles user interactions
 * @param {Telegraf} bot Bot to setup
 */
export const setup = (bot) => {
  // calendar instance
  const calendar = new Calendar(bot, {
    startWeekDay: 1,
    weekDayNames: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    monthNames: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
  })

  // listener quand on clique sur une date
  calendar.setDateListener(async (ctx, date) => {
    const chatId = ctx.chat.id
    const userId = ctx.from.id
    const userName = ctx.from.first_name || ctx.from.username || 'Quelqu’un'

    // Vérifier si la date est déjà réservée
    const { data: existing, error: selectError } = await supabase
      .from('reservations')
      .select('*')
      .eq('chat_id', chatId)
      .eq('date', date)
      .maybeSingle()

    if (selectError) {
      console.error('Supabase select error:', selectError)
      return ctx.reply('Erreur en vérifiant la base de données.')
    }

    if (!existing) {
      // 🔹 Créer une réservation
      const { error: insertError } = await supabase.from('reservations').insert([
        { chat_id: chatId, user_id: userId, user_name: userName, date: date }
      ])

      if (insertError) {
        console.error('Supabase insert error:', insertError)
        return ctx.reply('Erreur lors de la réservation.')
      }

      return ctx.reply(`✅ ${userName} a réservé le ${date}`)
    } else if (existing.user_id === userId) {
      // 🔹 Supprimer sa réservation (annuler)
      const { error: deleteError } = await supabase
        .from('reservations')
        .delete()
        .eq('id', existing.id)

      if (deleteError) {
        console.error('Supabase delete error:', deleteError)
        return ctx.reply('Erreur lors de l’annulation.')
      }

      return ctx.reply(`❌ Réservation du ${date} annulée pour ${userName}`)
    } else {
      // 🔹 Déjà réservé par quelqu’un d’autre
      return ctx.reply(
        `⚠️ Le ${date} est déjà réservé par ${existing.user_name}`
      )
    }
  })

  // Commande /calendar pour afficher le calendrier
  bot.command('calendar', async (ctx) => {
    const today = new Date()
    const minDate = new Date()
    minDate.setMonth(today.getMonth() - 2)
    const maxDate = new Date()
    maxDate.setMonth(today.getMonth() + 2)
    maxDate.setDate(today.getDate())

    try {
      await ctx.reply(
        '📅 Choisissez une date :',
        calendar.setMinDate(minDate).setMaxDate(maxDate).getCalendar()
      )
    } catch (err) {
      console.error('Erreur en envoyant le calendrier:', err)
      ctx.reply('Erreur en affichant le calendrier.')
    }
  })

  // Commande /list pour voir toutes les réservations du groupe
  bot.command('list', async (ctx) => {
    const chatId = ctx.chat.id

    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('chat_id', chatId)
      .order('date', { ascending: true })

    if (error) {
      console.error('Supabase list error:', error)
      return ctx.reply('Erreur en récupérant les réservations.')
    }

    if (!reservations || reservations.length === 0) {
      return ctx.reply('Aucune réservation pour ce groupe.')
    }

    const msg = reservations
      .map((r) => `📌 ${r.date} → ${r.user_name}`)
      .join('\n')

    return ctx.reply(`Réservations actuelles :\n\n${msg}`)
  })

  bot.catch((err) => {
    console.error('Error in bot:', err)
  })
}
