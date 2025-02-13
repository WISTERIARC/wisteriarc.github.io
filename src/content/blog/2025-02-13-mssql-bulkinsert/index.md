---
title: 'SQL Server on Linux へ Windows環境の Microsoft SQL Server Management Studio から BULK INSERT でデータ登録する'
slug: 'mssql-bulkinsert'
description: 'SQL Server on Linux へ Windows環境の Microsoft SQL Server Management Studio から BULK INSERT でデータ登録する'
pubDate: 'Feb 13 2025'
tags: ["SQL Server"]
---


## 背景

Windows Server の Hyper-V に Ubuntu 18.4 LTS と SQL Server 2019 Express の環境を構築。ここに Windows 10 のクライアントから 別途 DHW 等で取得した Shift-JIS の CSV ファイルを BULK INSERT で取り込みたかったので、動作時の記録です。

昔の環境であり、サポート切れとなっていますが、情報として残しておきます。  
照合順序を Japanese_XJIS_140_CI_AS_UTF8 等に設定しても、下記の SQL Server on Linux 環境では UTF-8 のファイルを BULK INSERT できませんでした。

## 環境

### 登録先のサーバ
- Ubuntu 18.4 LTS ( Hyper-V 仮想マシン )
- Microsoft SQL Server Express (64-bit)
  - サーバーのプロパティ / サーバーの照合順序 : Japanese_CI_AS
  - サーバーのプロパティ / バージョン : 15.0.4198.2
  - サーバーのプロパティ / 言語 : 日本語
  - データベースのプロパティ / 全般 / 照合順序 : Japanese_CI_AS
  - データベースのプロパティ / オプション / 既定の言語 : Japanese
  - 列のプロパティ / 全般 / データ型 : nvarchar
  - 列のプロパティ / 全般 / 照合順序 : Japanese_CI_AS

### クライアント
- Windows 10 22H2
- Microsoft SQL Server Management System 20.2.30.0
- nkf 2.1.1.1
- WinSCP 5.17.10

## 手順

### 1. 変換作業フォルダ（workdir）の構成

```
└─ workdir  
  ├─ nkf.exe  
  └─ Shift-JISのファイル.csv
```

### 2. nkf を使用してUTF16LE BOM有へ変換

```sh
cd workdir
nkf --ic=cp932 --oc=UTF-16LE-BOM "Shift-JISのファイル.csv" > "UTF16LEBOMのファイル.csv"
```

nkf（ Network Kanji Filter ）の各オプション

- --ic=cp932: 入力をCP932（Microsoft の Shift-JIS実装）として扱う
- --oc=UTF-16LE-BOM: 出力をBOM付きUTF-16LE（Windowsで一般的）に変換
- "Shift-JISのファイル.csv": 入力ファイル
- \>: 出力のリダイレクト
- "UTF16LEBOMのファイル.csv": 出力ファイル

※nkf -w16L で変換すると、全角チルダ（～）とかがうまく変換できなくてエラーになる

### 3. 変換後の作業フォルダの構成

```
└─ workdir  
  ├─ nkf.exe  
  ├─ Shift-JISのファイル.csv
  └─ UTF16LEBOMのファイル.csv
```

### 4. WinSCPを使用してサーバーに変換後のCSVファイルを移動させる

サーバーにさえファイルが移せれば何を使っても問題ないです。

### 5. Windwos の Microsoft SQL Server Management System で BULK INSERT を実行

```sql
  BULK
INSERT [テーブル名]
  FROM 'サーバーのCSVファイルパス'
  WITH
     ( DATAFILETYPE = 'widechar'
     , FORMAT = 'CSV'
     , ROWTERMINATOR = '\r\n'
     , FIRSTROW = 2
     )
```

- DATAFILETYPE = 'widechar': UTF-16形式のファイルを読み込む
- FORMAT = 'CSV': CSVファイル形式として処理
- ROWTERMINATOR = '\r\n': 改行コードはCRLF
- FIRSTROW = 2: 2行目からデータとして取り込む（1行目はヘッダー行）