---
title: 'FileMakerのスクリプト内でListとSortValueとGetValueを使って複数の変数から最小値を取得する'
slug: 'filemaker-sortvalue'
description: 'FileMakerのスクリプト内でListとSortValueとGetValueを使って複数の変数から最小値を取得する'
pubDate: 'Mar 01 2025'
tags: ["FileMaker"]
---

## 背景

FileMakerで医療情報データベースを作成していると、「患者さんの最も最初に行った治療をリストアップして」と言われることがままあります。
テーブルが1つなら簡単ですが、「処方」と「手術」と「内視鏡検査」のようなテーブルが別な場合が少々めんどくさい。

SQLを書いても良いですがFileMakerの知識で完結しないので、事務方管理のスクリプトに採用はしづらいです。

そんな時よく使うのが以下の関数の組み合わせです。  
前提としてテーブルごとの初回日は取得済みとします。

## 式

```
GetValue ( SortValues ( List ("2025/4/1" ; "2025/5/15"; "2025/3/18") ; 3 ) , 1 )
```

## 使う関数

- GetValue
- SortValues
- List

### 1. List関数

```
List ("2025/4/1" ; "2025/5/15"; "2025/3/18")
```

List関数は、複数の値を連結してリスト（改行区切りのテキスト）を作成します。FileMakerでは、複数の値を保持する際に改行文字（¶）で区切る方法がよく使われます。

この例では、"2025/4/1", "2025/5/15", "2025/3/18" の3つの日付を連結して以下のようなリストを作成します

```
2025/4/1¶
2025/5/15¶
2025/3/18
```

[Claris FileMaker Pro ヘルプ > リファレンス > 関数リファレンス > 統計関数 > List](https://help.claris.com/ja/pro-help/content/list.html)

### 2. SortValues関数

```
SortValues ( List ("2025/4/1" ; "2025/5/15"; "2025/3/18") ; 3 )
```

SortValues関数は、リストの値を特定の順序で並べ替えます。

- 第1引数：並べ替えるリスト
- 第2引数：並べ替えのオプション

第2引数の値によって並べ替えの方法が決まります。
この例では、リスト内のデータが日付のデータなので「**3**」を指定しています。List関数で作成したリスト`2025/4/1¶2025/5/15¶2025/3/18`を第2引数の指定に従って並べ替えるので、このようになります。

```
2025/3/18¶
2025/4/1¶
2025/5/15
```

[Claris FileMaker Pro ヘルプ > リファレンス > 関数リファレンス > テキスト関数 > SortValues](https://help.claris.com/ja/pro-help/content/sortvalues.html)

### 3. GetValue関数

```
GetValue ( SortValues ( List ("2025/4/1" ; "2025/5/15"; "2025/3/18") ; 3 ) , 1 )
```

GetValue関数は、リスト内の特定の位置にある値を取得します。

- 第1引数：値を取得するリスト
- 第2引数：取得する値の位置（1が最初の値）

この例では、SortValues関数で並べ替えられたリストの「**1**」行目の値を取得します。

```
2025/3/18
```

[Claris FileMaker Pro ヘルプ > リファレンス > 関数リファレンス > テキスト関数 > GetValue](https://help.claris.com/ja/pro-help/content/getvalue.html)

## まとめ

FileMakerのリスト関連の関数を使うことで、複数の値を効率的に処理することができます。今回紹介した式は、リストを作成し、それを並べ替え、特定の位置の値を抽出するという一連の処理を一行で行う例です。

実際の業務で使用する際は、FileMakerの公式ドキュメントや最新のリファレンスを参照し、各関数の詳細な仕様や使用例を確認することをお勧めします。