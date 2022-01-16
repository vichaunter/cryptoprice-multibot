# Crypto Price Multibot

Bot to receive alerts when price cross specific value in any exchange with support for multiple platforms.

Platforms:
* Telegram (✅)
* Discord (🕑)

Exchanges:
* Bybit (✅)
* Binance (🕑)

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

## Bot usage

Once connected to bot there is some commands that you can use, default welcome one is help.

`/help`

`/add`

Command parameters:
* symbol: string
* price: number
* direction: string - "up" or "down" (default up)
* remove: string - if set alert will be removed after firing

Example:
```
/add BTCUSD 50000 up remove
this will send you an alert when price of BTCUSD will be 50000 
or greater and was less before, will also auto remove it after 
send the alert
```

Used for creating new alert, you can have as many alerts as you want for one symbol, but only one per symbol/price.

Alerts will be delivered only once per minute to avoid spam you. 

`/list`

Will show you a list of your current alerts sorted by price from more to less.

Under each price you will have a remove button to cancel the alert at that price.
