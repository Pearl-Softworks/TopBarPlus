<!-- markdownlint-disable MD033 -->

# TopbarPlusPlus

A patched TopbarPlus for executors. Construct dynamic and intuitive topbar icons. Enhance the appearance and behaviour of these icons with features such as themes, dropdowns and menus.

- [View the Docs](./docs/index.md) *(Original TopbarPlus docs)*

## Installation & Usage

There are two main ways to use TopbarPlusPlus

### Dynamic fetching over HTTP

> This will use `loadstring` and `HttpGetAsync`.

```luau
local function ImportRelease(Owner, Repository, Version, File)
    local Tag = (version == "latest" and "latest/download" or "download/"..version)

    return loadstring(game:HttpGetAsync(("https://github.com/%s/%s/releases/%s/%s"):format(Owner, Repository, Tag, File)), File)()
end

local PearlTopBar = ImportRelease("biggaboy212", "TopbarPlusPlus", "latest", "topbarPP.luau")
```