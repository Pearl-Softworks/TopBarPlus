import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const Root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const Src = path.join(Root, "src");
const Output = path.join(Root, "TopBarPlus.luau");

function NormalizeKey(filePath) {
	const rel = path.relative(Src, filePath).replace(/\\/g, "/");
	if (rel.endsWith("/init.luau")) {
		return rel.slice(0, -"/init.luau".length);
	}
	if (rel.endsWith(".luau")) {
		return rel.slice(0, -".luau".length);
	}
	return rel;
}

function ResolveModulePath(fromFile, req) {
	const moduleDir = path.dirname(fromFile);

	if (req.startsWith("@self/")) {
		return ResolveFile(path.join(moduleDir, req.slice("@self/".length)));
	}

	if (req.startsWith("./") || req.startsWith("../")) {
		const baseDir = fromFile.endsWith("init.luau") ? path.dirname(moduleDir) : moduleDir;
		return ResolveFile(path.join(baseDir, req));
	}

	return ResolveFile(path.join(Src, req));
}

function ResolveFile(basePath) {
	const candidates = [
		basePath,
		`${basePath}.luau`,
		path.join(basePath, "init.luau"),
	];

	for (const candidate of candidates) {
		if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
			return path.normalize(candidate);
		}
	}

	throw new Error(`Could not resolve module at ${basePath}`);
}

function CollectFiles(dir) {
	const files = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...CollectFiles(full));
		} else if (entry.name.endsWith(".luau")) {
			files.push(full);
		}
	}
	return files;
}

function ExtractRequires(source) {
	const requires = [];
	const pattern = /require\(\s*(['"])([^'"]+)\1\s*\)/g;
	let match;
	while ((match = pattern.exec(source)) !== null) {
		requires.push(match[2]);
	}
	return requires;
}

function TransformRequires(source, fromFile, keyByFile) {
	return source.replace(/require\(\s*(['"])([^'"]+)\1\s*\)/g, (_, quote, req) => {
		const resolved = ResolveModulePath(fromFile, req);
		const key = keyByFile.get(resolved);
		return `__BUNDLED_MODULES[${quote}${key}${quote}]()`;
	});
}

const files = CollectFiles(Src);
const keyByFile = new Map(files.map((file) => [file, NormalizeKey(file)]));

const graph = new Map();
for (const file of files) {
	const source = fs.readFileSync(file, "utf8");
	const deps = ExtractRequires(source).map((req) => ResolveModulePath(file, req));
	graph.set(file, deps);
}

const sorted = [];
const visiting = new Set();
const visited = new Set();

function Visit(file) {
	if (visited.has(file)) {
		return;
	}
	if (visiting.has(file)) {
		throw new Error(`Circular dependency at ${file}`);
	}
	visiting.add(file);
	for (const dep of graph.get(file) ?? []) {
		Visit(dep);
	}
	visiting.delete(file);
	visited.add(file);
	sorted.push(file);
}

Visit(ResolveFile(path.join(Src, "main")));

const chunks = [
	"-- Bundled for HTTP loadstring. Regenerate with: node scripts/bundle.mjs",
	"local __BUNDLED_MODULES = {}",
	"",
];

for (const file of sorted) {
	const key = keyByFile.get(file);
	const source = fs.readFileSync(file, "utf8");
	const body = TransformRequires(source, file, keyByFile);
	chunks.push(`__BUNDLED_MODULES["${key}"] = function()`);
	chunks.push(body);
	chunks.push("end");
	chunks.push("");
}

chunks.push('return __BUNDLED_MODULES["main"]()');
chunks.push("");

fs.writeFileSync(Output, chunks.join("\n"));
console.log(`Wrote ${Output} (${chunks.join("\n").length} bytes)`);
