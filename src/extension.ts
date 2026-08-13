import * as vscode from 'vscode';

const CONFIG_SECTION = 'marketView';
const DEFAULT_SYMBOL = 'CME_MINI:MNQ1!';
const DEFAULT_INTERVAL = '2';

type BrowserCommand = 'simpleBrowser.api.open' | 'simpleBrowser.show';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('marketView.openTradingViewMnq', () => openTradingViewMnq()),
    vscode.commands.registerCommand('marketView.openTradingViewExternal', () => openTradingViewExternal()),
    vscode.commands.registerCommand('marketView.copyTradingViewUrl', () => copyTradingViewUrl())
  );
}

export function deactivate() {}

async function openTradingViewMnq(): Promise<void> {
  const url = getTradingViewUrl();
  const preferredCommand = getPreferredBrowserCommand();
  const fallbackCommands = getFallbackBrowserCommands(preferredCommand);

  for (const command of [preferredCommand, ...fallbackCommands]) {
    const opened = await tryOpenInVsCodeBrowser(command, url);
    if (opened) {
      return;
    }
  }

  await openExternal(url, 'VS Code browser commands were unavailable, so TradingView opened in your default browser.');
}

async function openTradingViewExternal(): Promise<void> {
  await openExternal(getTradingViewUrl());
}

async function copyTradingViewUrl(): Promise<void> {
  const url = getTradingViewUrl().toString();
  await vscode.env.clipboard.writeText(url);
  vscode.window.showInformationMessage('Copied TradingView MNQ URL.');
}

function getTradingViewUrl(): vscode.Uri {
  const config = vscode.workspace.getConfiguration(CONFIG_SECTION);
  const symbol = config.get('symbol', DEFAULT_SYMBOL).trim() || DEFAULT_SYMBOL;
  const interval = config.get('interval', DEFAULT_INTERVAL).trim() || DEFAULT_INTERVAL;

  const params = new URLSearchParams({
    symbol,
    interval
  });

  return vscode.Uri.parse(`https://www.tradingview.com/chart/?${params.toString()}`);
}

function getPreferredBrowserCommand(): BrowserCommand {
  const command = vscode.workspace
    .getConfiguration(CONFIG_SECTION)
    .get<BrowserCommand>('preferredBrowserCommand', 'simpleBrowser.api.open');

  return command === 'simpleBrowser.show' ? command : 'simpleBrowser.api.open';
}

function getFallbackBrowserCommands(preferredCommand: BrowserCommand): BrowserCommand[] {
  const commands: BrowserCommand[] = ['simpleBrowser.api.open', 'simpleBrowser.show'];
  return commands.filter((command) => command !== preferredCommand);
}

async function tryOpenInVsCodeBrowser(command: BrowserCommand, url: vscode.Uri): Promise<boolean> {
  try {
    if (command === 'simpleBrowser.api.open') {
      await vscode.commands.executeCommand(command, url, {
        preserveFocus: false,
        viewColumn: vscode.ViewColumn.Beside
      });
    } else {
      await vscode.commands.executeCommand(command, url.toString());
    }

    return true;
  } catch {
    return false;
  }
}

async function openExternal(url: vscode.Uri, fallbackReason?: string): Promise<void> {
  const opened = await vscode.env.openExternal(url);

  if (!opened) {
    vscode.window.showErrorMessage(`Unable to open TradingView: ${url.toString()}`);
    return;
  }

  if (fallbackReason && shouldShowFallbackNotifications()) {
    vscode.window.showInformationMessage(fallbackReason);
  }
}

function shouldShowFallbackNotifications(): boolean {
  return vscode.workspace
    .getConfiguration(CONFIG_SECTION)
    .get('showFallbackNotifications', true);
}
