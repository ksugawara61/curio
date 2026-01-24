#!/bin/bash

# Read JSON input from stdin
input=$(cat)

# Extract file path from tool_input
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# Exit if no file path
if [ -z "$file_path" ]; then
  exit 0
fi

# Check if the file is in apps/extension/src and matches the pattern (ts, tsx)
if [[ "$file_path" == apps/extension/src/*.ts ]] || [[ "$file_path" == apps/extension/src/*.tsx ]]; then
  # Run eslint --fix on the file
  cd "$CLAUDE_PROJECT_DIR"
  pnpm --filter @curio/extension lint --fix "$file_path" 2>&1
fi

exit 0
