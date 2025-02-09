---
title: 'M1 mac mini にVNCで繋いでいると起動したスクリーンセーバーがGUI上で解除できなくなった時の対処'
slug: 'mac-screensaver-turnoff'
description: 'M1 mac mini にVNCで繋いでいると起動したスクリーンセーバーがGUI上で解除できなくなった時の対処'
pubDate: 'Feb 10 2025'
tags: ["mac mini"]
---

## 背景

Filemaker Server のサーバーマシンとして M1 mac mini を試用しています。  
サーバー用途なのでディスプレイは接続しておらず、UltraVNCでリモート接続をしている環境です。  
UltraVNCでMac miniに接続して作業していると、作業中にもかかわらず一定時間後にスクリーンセーバーが勝手に起動してしまいます。  

ctrl + alt + Q のショートカットでログイン画面は表示されるのですが、パスワードを入力してもスクリーンセーバーの画面に戻されるだけです。

対応としては、SSHからスクリーンセーバーのプロセスを強制的に止めることになります。
サーバー用途なので、一旦はこれでいいことにしています。

## 環境

- M1 mac mini 2022
- RAM 16GB
- SSD 256GB
- OS macOS 13

## スクリーンセーバーのプロセスID番号を探す

```terminal
ps ax | grep -i screensaver
```

上記コマンドは、実際には2つのコマンドをパイプ（|）でつないでいます。

1. ps ax

   - ps: 実行中のプロセスを表示するコマンド（Process Status の略）
   - a: 全ユーザーのプロセスを表示
   - x: 制御端末（ターミナル）を持たないプロセスも含めて表示

2. | (パイプ)

   左側のコマンドの出力を、右側のコマンドの入力として渡す  
   つまり、ps ax の結果を grep コマンドに渡している事になります

3. grep -i screensaver

   - grep: 指定した文字列を検索するコマンド
   - -i: 大文字小文字を区別しない（ignore case の略）  
     例：Screensaver、SCREENSAVER、screensaver のどれでもマッチする
   - screensaver: 検索したい文字列

## 結果の確認

結果は以下のような形式で表示されます

```terminal
11488 s016 R+ 0:00.00 grep -i screensaver
11490 ?? S 0:00.23 /System/Library/CoreServices/ScreenSaverEngine.app/Contents/MacOS/ScreenSaverEngine
```

1行目は実行したコマンド自体です。  
2行目が目的の結果で、左端の数字がプロセスID番号なので、これをメモします。

## スクリーンセーバーを強制終了


数字の入力は慎重に行ってください。タイプミスは、軽微な問題から重大な事態（例：保存していない作業中のドキュメントを持つアプリを誤って終了するなど）を引き起こす可能性があります

```terminal
kill -9 <プロセスID番号>
```

<プロセスID番号>の部分を、先ほど確認した番号に置き換えます。

入力コマンドをもう一度確認してからEnterを押します。

うまくいけば、元の作業画面に戻れるはずです！