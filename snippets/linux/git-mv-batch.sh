for f in $(git ls-files -- '*.tsx'); do git mv -k $f $(tr '[:upper:]' '[:lower:]' <<<"$f"); done
