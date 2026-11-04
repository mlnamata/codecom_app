#!/usr/bin/env bash
# Zkopíruje sdílené balíčky a obsah ukázkové obce z repozitáře mlnamata/codecom.
# Zdrojem pravdy zůstává codecom; tady se nic z toho ručně neupravuje.
# Použití: scripts/synchronizuj-sdilene.sh [cesta-k-codecom]   (výchozí ../codecom)
set -euo pipefail

koren="$(cd "$(dirname "$0")/.." && pwd)"
zdroj="${1:-$koren/../codecom}"

if [ ! -d "$zdroj/packages/typy" ]; then
  echo "Nenašel jsem codecom v $zdroj. Zadej cestu jako první argument." >&2
  exit 1
fi

for balicek in tokeny typy demo-data; do
  rsync -a --delete --exclude node_modules "$zdroj/packages/$balicek/" "$koren/packages/$balicek/"
done
rsync -a --delete "$zdroj/obsah/javori-lhota/" "$koren/obsah/javori-lhota/"

# Generátor tokenů žije jen v codecom, tady by skript nefungoval.
node -e '
const fs = require("fs");
const p = process.argv[1];
const d = JSON.parse(fs.readFileSync(p, "utf8"));
delete d.scripts.generate;
fs.writeFileSync(p, JSON.stringify(d, null, 2) + "\n");
' "$koren/packages/tokeny/package.json"

echo "Zkopírováno z $zdroj ($(git -C "$zdroj" rev-parse --short HEAD 2>/dev/null || echo 'neznámý commit'))."
