FROM node:20-slim

WORKDIR /app

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# pnpmをインストール
# RUN corepack enable && corepack prepare pnpm@latest --activate

# pnpmをインストールして、グローバルストアディレクトリを設定
RUN corepack enable && \
    corepack prepare pnpm@latest --activate && \
    pnpm config set store-dir /root/.local/share/pnpm/store/v3 --global

COPY package*.json pnpm-lock.yaml ./

# 依存関係をインストール
RUN pnpm install --frozen-lockfile

# 開発サーバーのポートを公開
EXPOSE 4321

# 開発サーバーを起動
# CMD ["pnpm", "run", "dev"]
# 開発サーバーを起動
# CMD ["sh", "-c", "if [ ! -f package.json ]; then pnpm create astro@latest -- --template MichalRsa/freelance-sample-page . --yes && pnpm install; fi && pnpm run dev"]


CMD ["sh", "-c", "pnpm install && pnpm run dev"]