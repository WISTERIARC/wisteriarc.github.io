---
title: 'PowerShell で Windows エクスプローラー の名前の並び順でファイルリストを取得する'
slug: 'powershell-naturalsort'
description: 'PowerShell で Windows エクスプローラー の名前の並び順でファイルリストを取得する'
pubDate: 'Mar 30 2025'
tags: ["PowerShell"]
---

## 背景

フォルダ内のファイル一覧を使っている時によく Dir コマンドを使って一覧を取得する事があります。
プログラム処理したり、件数が少なかったりするとあまり気にしないのですが、エクスプローラーの「名前」でソートした並び順と、Dirのオプションでファイル名順で取得した場合で結果が違います。

ファイル一覧を使って数件ずつ分担をして作業を進めることがあると、地味に不便なのですよね。
ここでは PowerShell での取得方法について記載します。

Windows Shell の機能を利用して、エクスプローラーで表示されるのと同じ「自然順」でファイルリストを取得します。Shell.Applicationオブジェクトを使用することで、Windowsエクスプローラーの並び順のロジックを活用しています。

```powershell
# WindowsのShellクラスを使用して自然順でファイルを取得する
# ps1の実行ファイル保存場所の一覧を取得する
# パスを指定する場合はオプションを指定する Get-FilesInNaturalOrder -Path "C:\hogehoge-folder"

function Get-FilesInNaturalOrder {
    param (
        [Parameter(Mandatory=$false)]
        [string]$Path = (Get-Location).Path
    )

    # Shell.Applicationオブジェクトを作成
    $shell = New-Object -ComObject Shell.Application
    
    # 指定されたパスのフォルダオブジェクトを取得
    $folder = $shell.NameSpace($Path)
    
    # ファイルとフォルダの配列を作成
    $items = @()
    
    # フォルダ内のすべてのファイルを走査
    for ($i = 0; $i -lt $folder.Items().Count; $i++) {
        $item = $folder.Items().Item($i)
        $items += $item.Name
    }
    
    # 結果を返す
    return $items
}

# 現在のディレクトリのファイルを自然順で表示
$files = Get-FilesInNaturalOrder
$files | ForEach-Object { Write-Host $_ }

```

PowerShell で実行すると、現在のフォルダのファイルリストが自然順で表示されます。
特定のパスのファイルを表示したい場合は、-Path で指定してください。