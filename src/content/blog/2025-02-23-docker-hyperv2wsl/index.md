---
title: 'Windows 11 での Docker Desktop の環境を Hyper-V から WSL2 へ移行する'
slug: 'docker-hyperv2wsl'
description: ''
pubDate: 'Feb 23 2025'
tags: ["Docker"]
---

## 背景

Windows 11 環境で Hyper-V ベースの Docker を運用していた際に、vhdxファイルが破損して Docker Desktop が起動できなくなった場合の復旧手順をご紹介します。この記事では、Hyper-V から WSL2 への移行も含めた形で環境の再構築を行います。

## 環境

### ハードウェア

- Windows 11 Pro 23H2
- AMD Ryzen 7 3800X
- RAM 32GB

### BIOS/UEFI設定
以下の機能を有効化

- Virtualization Technology (VT-x/AMD-V)
- Second Level Address Translation (SLAT)
- Memory Protection Extensions

## WSL2 と Hyper-V の簡単な比較

### WSL2のメリット

- パフォーマンスが良好（特にファイル共有の速度）
- メモリ管理が動的
- Windowsとの統合が優れている
- ディスク容量の管理が柔軟

### Hyper-Vのメリット

- 完全な仮想化による分離性の高さ
- より従来型のVM管理が可能
- 企業環境での管理のしやすさ

## 注意点

- すべてのコマンドは管理者権限のPowerShellで実行する必要があります
- インストール中にWindows セキュリティのポップアップが表示される場合があります
- インストール後の初回起動時はログインが必要な場合があります
- Windows 10/11 Homeエディションの場合、WSL2が必須となります
- アンチウイルスソフトウェアがDockerの動作を妨げる場合があります

## 環境再構築の詳細手順

### 1. 既存環境のクリーンアップ

#### WSLの実行中のインスタンスをすべて停止

```powershell
wsl --shutdown
```

- --shutdown: 実行中のすべてのWSLインスタンスを停止

#### Dockerのクリーンアップ（デーモン起動時のみ実行可能）

```powershell
docker system prune -a --volumes
```

- system prune: 未使用のシステムリソースを削除
- -a: すべての未使用イメージを削除
- --volumes: 未使用のボリュームを削除

注意: `docker system prune` コマンドは、Docker デーモンが停止している場合は実行できません。以下のようなエラーが出る場合は無視して次の手順に進んでください。

```powershell
error during connect: Head "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/_ping": 
open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

### 2. Docker Desktopのアンインストール

1. Windowsの「スタート」メニュー→「設定」→「アプリ」→「アプリと機能」を開く
2. 一覧から「Docker Desktop」を選択
3. 「アンインストール」をクリック
4. アンインストールウィザードの指示に従う
5. 完了後、PCを再起動

### 3. 残存ファイルのクリーンアップ

#### 削除される内容

- Dockerの設定ファイル
- 認証情報
- コンテキスト情報
- Docker Desktopの設定

#### 注意点

- 管理者権限のPowerShellで実行する必要がある
- 削除後は元に戻せないので注意
- Docker Desktopが実行中の場合は、一部ファイルが削除できない可能性がある

以下コマンドは、Docker環境を完全にクリーンアップする時につかうものなので、新規インストール時のような初期状態に戻すために実行します。

#### Dockerの設定ファイルを削除（ユーザーフォルダ配下）

```powershell
Remove-Item "$env:USERPROFILE\.docker" -Recurse -Force
```
#### Dockerのグローバル設定を削除（ProgramData配下）

```powershell
Remove-Item "$env:ProgramData\Docker" -Recurse -Force
```

- Remove-Item: PowerShellのコマンドレットで、ファイルやフォルダを削除するために使用
- $env:USERPROFILE: 現在のユーザーのプロファイルフォルダへのパス
- \\.docker: ユーザーフォルダ内の.dockerディレクトリ
- -Recurse: サブディレクトリとファイルを含めて再帰的に削除(このオプションがないと、空でないディレクトリは削除できない)
- -Force: 以下のような通常保護されているファイルも強制的に削除
  - 読み取り専用ファイル
  - 隠しファイル
  - システムファイル

### 4. WSL2の有効化

以下のコマンドを管理者権限のPowerShellで実行します

#### Windows Subsystem for Linuxを有効化

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

- /online: 実行中のシステムに対して操作
- /enable-feature: Windows機能の有効化
- /featurename: 対象機能の指定
- /all: 必要な依存機能もすべて有効化
- /norestart: 再起動を保留

#### 仮想マシンプラットフォームを有効化

```powershell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

### 5. 再起動

### 6. WSL2のLinuxカーネルアップデートパッケージをインストール

- [WSL2 Linux kernel update package](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)をダウンロード
- ダウンロードしたMSIファイルを実行

### 7. WSL2をデフォルトバージョンとして設定

```powershell
wsl --set-default-version 2
```

- --set-default-version: WSLのデフォルトバージョンを設定
- 2: WSLバージョン2を指定

### 8. Docker Desktopのインストール

1. [Docker Desktop公式サイト](https://www.docker.com/products/docker-desktop/)から最新版をダウンロード
2. ダウンロードしたインストーラー（Docker Desktop Installer.exe）を実行
3. インストール時の設定：
   - 「Use WSL 2 instead of Hyper-V」にチェック（推奨）
   - 「Install required Windows components for WSL 2」にチェック
   - 「Add shortcut to desktop」（任意）
   - 「Start Docker Desktop when you log in」（任意）
4. 「Accept」をクリックしてライセンス契約に同意
5. インストールが完了したら「Close and restart」をクリック

### 9. Docker Desktop初期設定

1. Docker Desktopを起動
2. 設定（歯車アイコン）を開く
3. 「General」セクション：
   - 「Use the WSL 2 based engine」が有効になっていることを確認
4. 「Resources」→「WSL Integration」：
   - 使用したいWSLディストリビューションを有効化
5. 「Apply & Restart」をクリック

### 10. 動作確認

#### Dockerの詳細情報を表示

```powershell
docker info
```

## いろいろな情報確認

問題が発生した場合は、以下のコマンドで状況を確認

### WSLのディストリビューション一覧と状態を表示

```powershell
wsl -l -v
```

- -l: インストール済みディストリビューションを一覧表示
- -v: バージョン情報を表示

### WSLディストリビューションの状態確認

```powershell
wsl --status
```

- --status: WSLディストリビューションの状態
  - 既定のディストリビューション
  - 既定のバージョン

### Dockerの詳細情報表示

```powershell
docker info
```

### Docker用WSLディストリビューションの登録解除（必要な場合）

```powershell
wsl --unregister docker-desktop
wsl --unregister docker-desktop-data
```