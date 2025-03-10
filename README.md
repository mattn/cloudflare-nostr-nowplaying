# cloudflare-now-playing

Last.fm の音楽再生履歴にアップされる最新曲情報を Nostr のステータスに反映します。


このガイドは、プログラミング経験がない人でも **Windows 環境** で Cloudflare Workers に [`cloudflare-nostr-nowplaying`](https://github.com/mattn/cloudflare-nostr-nowplaying) をデプロイする手順を説明します。

## 1. Cloudflare アカウントの作成

Cloudflare Workers を使用するには、Cloudflare のアカウントが必要です。

### **手順**

1. [Cloudflare の公式サイト](https://dash.cloudflare.com/sign-up) にアクセス。
2. 必要な情報（メールアドレス、パスワード）を入力して **Sign Up** をクリック。
3. 確認メールが届くので、リンクをクリックしてアカウントを有効化。

## 2. 必要なソフトウェアのインストール

### **Node.js のインストール**

1. [Node.js の公式サイト](https://nodejs.org/) にアクセス。
2. **LTS（推奨版）** をダウンロードしてインストール。
3. インストール完了後、Windows の **コマンドプロンプト** を開き、以下のコマンドを入力して確認。
   ```sh
   node -v
   npm -v
   ```
   それぞれバージョンが表示されれば OK。

### **Wrangler のインストール（Cloudflare CLI）**

1. コマンドプロンプトを開き、以下のコマンドを実行。
   ```sh
   npm install -g wrangler
   ```
2. インストール完了後、以下のコマンドで動作確認。
   ```sh
   wrangler -V
   ```
   バージョンが表示されれば OK。

## 3. Cloudflare Workers の認証

1. 以下のコマンドを実行してログイン。
   ```sh
   wrangler login
   ```
2. ブラウザが開くので Cloudflare にログインし、認証を許可。

## 4. Git のインストール

Git がインストールされていない場合、以下の手順でインストール。

1. [Git の公式サイト](https://git-scm.com/) にアクセス。
2. Windows 用のインストーラーをダウンロードし、指示に従ってインストール。
3. インストール完了後、以下のコマンドを実行して動作確認。
   ```sh
   git --version
   ```
   バージョンが表示されれば OK。

## 5. リポジトリのクローン

1. コマンドプロンプトを開き、作業ディレクトリに移動。
   ```sh
   cd %USERPROFILE%/Desktop
   ```
2. `cloudflare-nostr-nowplaying` のリポジトリをクローン。
   ```sh
   git clone https://github.com/mattn/cloudflare-nostr-nowplaying.git
   ```
3. クローンしたフォルダに移動。
   ```sh
   cd cloudflare-nostr-nowplaying
   ```

## 6. Cloudflare Workers のセットアップ

### **KV (Key-Value ストア) の作成**

```sh
wrangler kv:namespace create nostr_nowplaying
```
実行すると `kv_namespaces` の ID が表示されるので、`wrangler.toml` に追加。

### **デプロイ**

```sh
wrangler deploy
```

### **環境変数の設定**

1. `BOT_NSEC` を設定。
   ```sh
   wrangler secret put BOT_NSEC
   ```
   → プロンプトが出るので、値を入力し Enter。

2. `LASTFM_USERNAME` を設定。
   ```sh
   wrangler secret put LASTFM_USERNAME
   ```
   → プロンプトが出るので、値を入力し Enter。

3. `LASTFM_API_KEY` を設定。
   ```sh
   wrangler secret put LASTFM_API_KEY
   ```
   → プロンプトが出るので、値を入力し Enter。

## 7. 動作確認

Cloudflare Workers のデプロイが完了したら、表示された URL にアクセスして動作確認。

これで完了です！ 🎉

