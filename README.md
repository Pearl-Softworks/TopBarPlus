<!-- markdownlint-disable MD033 -->

# TopbarPlusPlus

A patched TopbarPlus for executors. Construct dynamic and intuitive topbar icons. Enhance the appearance and behaviour of these icons with features such as themes, dropdowns and menus.

- [View the Docs](./docs/index.md) *(Original TopbarPlus docs)*

## Installation & Usage

### Dynamic fetching over HTTP

> Uses `loadstring` and `HttpGetAsync` against the bundled [`TopBarPlus.luau`](./TopBarPlus.luau) on `main`. Pin a branch or tag in production.

```luau
local Repo = "Pearl-Softworks/TopBarPlus"
local File = "TopBarPlus.luau"

local function ImportTopBarPlus(Ref: string?)
	local Url = ("https://raw.githubusercontent.com/%s/%s/%s"):format(Repo, Ref or "main", File)
	return loadstring(game:HttpGetAsync(Url), File)()
end

local Icon = ImportTopBarPlus()
-- local Icon = ImportTopBarPlus("v1.0.0")
```

Or as a one-liner:

```luau
local PearlTopBar = loadstring(
	game:HttpGetAsync("https://raw.githubusercontent.com/Pearl-Softworks/TopBarPlus/main/TopBarPlus.luau"),
	"TopBarPlus"
)()
```

Rebuild the bundle after changing `src/`:

```sh
node scripts/bundle.mjs
```