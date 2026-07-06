<!-- markdownlint-disable MD033 -->

# TopbarPlusPlus

A patched TopbarPlus for executors. Construct dynamic and intuitive topbar icons. Enhance the appearance and behaviour of these icons with features such as themes, dropdowns and menus.

- [View the Docs](./docs/index.md) *(Original TopbarPlus docs)*

## Installation & Usage

### Dynamic fetching over HTTP

> This uses `loadstring` and `HttpGetAsync`. Pin a branch or tag in production (e.g. `main`, `v1.0.0`).

```luau
local Repo = "Pearl-Softworks/TopBarPlus"
local File = "TopBarPlus.luau"

local function ImportTopBarPlus(Ref: string?)
	local Url = ("https://raw.githubusercontent.com/%s/%s/%s"):format(Repo, Ref or "main", File)
	return loadstring(game:HttpGetAsync(Url), File)()
end

local PearlTopBar = ImportTopBarPlus()
-- local PearlTopBar = ImportTopBarPlus("v1.0.0")
```

Or as a one-liner:

```luau
local PearlTopBar = loadstring(game:HttpGetAsync("https://raw.githubusercontent.com/Pearl-Softworks/TopBarPlus/main/TopBarPlus.luau"), "TopBarPlus")()
```