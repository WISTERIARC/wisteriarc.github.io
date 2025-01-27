FROM node:20-slim

WORKDIR /app

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# pnpmをインストール
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json ./

# 開発サーバーのポートを公開
EXPOSE 4321

# 開発サーバーを起動
# CMD ["pnpm", "run", "dev"]
# 開発サーバーを起動
# CMD ["sh", "-c", "if [ ! -f package.json ]; then pnpm create astro@latest -- --template MichalRsa/freelance-sample-page . --yes && pnpm install; fi && pnpm run dev"]


CMD ["sh", "-c", "pnpm install && pnpm run dev"]