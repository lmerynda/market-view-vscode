# Market View for VS Code

Market View opens an MNQ 2-minute TradingView chart from VS Code without handling
your TradingView credentials, cookies, or market data.

The extension is intentionally small. Its main command opens the real TradingView
chart URL so you can log in through VS Code's browser surface or your default
browser and use the live data entitlement attached to your TradingView account.
It does not scrape, proxy, transform, or redistribute TradingView market data.

## Commands

- `Market View: Open MNQ TradingView`
- `Market View: Open MNQ TradingView Externally`
- `Market View: Copy MNQ TradingView URL`

## Settings

- `marketView.symbol`: defaults to `CME_MINI:MNQ1!`
- `marketView.interval`: defaults to `2`
- `marketView.preferredBrowserCommand`: defaults to `simpleBrowser.api.open`
- `marketView.showFallbackNotifications`: defaults to `true`

The generated chart URL is:

```text
https://www.tradingview.com/chart/?symbol=CME_MINI%3AMNQ1%21&interval=2
```

## Live Data Notes

TradingView real-time exchange data is tied to the authenticated TradingView
website/app experience. Public TradingView widgets do not inherit paid account
market data entitlements, so this extension prefers opening TradingView itself
over embedding a widget.

For persistent logins in VS Code's browser features, set:

```json
{
  "workbench.browser.dataStorage": "global"
}
```

Use `workspace` instead if you want browser storage isolated to this workspace.

## Development

```bash
npm install
npm run package
```

Then press `F5` in VS Code to launch an Extension Development Host and run the
`Market View: Open MNQ TradingView` command.

In browser-based Codespaces, use the `Run Web Extension` launch configuration.
The command may open TradingView in a separate browser tab if VS Code's Simple
Browser command is unavailable in that environment. That is still compatible
with the live-data strategy because TradingView owns the login/session.
