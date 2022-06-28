# Calendar Telegraf Bot

Example of a bot that is using [telegraf-calendar-telegram](https://github.com/gianlucaparadise/telegraf-calendar-telegram).
You can contact [@CalendarTelegrafBot](https://t.me/CalendarTelegrafBot) to test the calendar.

## Hook setup

You can call `GET https://telegraf-calendar-telegram-bot-gianlucaparadise.vercel.app/api/telegram-hook?setWebhook=true` to setup the webhook. This operation needs to be performed only once, after the first deploy.

## Deploy and Environments

- Run `yarn deploy` to deploy in _Preview_ environment
- Configure Vercel Git integration to automatically deploy `main` branch in _Production_ environment

With this setup you can configure two different Bot tokens for _Preview_ and _Production_ so that you can use one bot for local testing and the other one for production.

# Reference

This bot is using webhooks and it is hosted on Vercel. I used this repository as reference:

- https://github.com/jsjoeio/telegram-bot-template
