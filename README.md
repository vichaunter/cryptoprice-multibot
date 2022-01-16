# Crypto Price Multibot

Bot to receive alerts when price cross specific value in any exchange with support for multiple platforms.

Platforms:
    - Telegram (✅)
    - Discord (🕑)

Exchanges:
    - Bybit (✅)
    - Binance (🕑)

## Requirements

### Register your bot and get the token

Got o Telegram in any device, press on search and find `@bothfather`

Send to @botfather the message `/newbot` and when it will ask name it as you witsh
ending on bot: `my-crypto-fancy-name-bot`.

A token will be generated, copy file `.env.example` into `.env` file, and fill the `BOT_TOKEN`
with your given token.

### Install all required packages

Simply run `yarn`, or `npm install` in this folder to install all dependencies.

## Running the bot

Just run `yarn start`

The bot will run and the exchanges will not be connected until there is some alert.
