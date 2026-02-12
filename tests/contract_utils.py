from __future__ import annotations

import re
from pathlib import Path
from typing import Dict, List, Set


REPO_ROOT = Path(__file__).resolve().parents[1]


def read_repo_file(relative_path: str) -> str:
    return (REPO_ROOT / relative_path).read_text(encoding="utf-8")


def parse_openapi_paths(openapi_text: str) -> Set[str]:
    paths: Set[str] = set()
    in_paths = False

    for line in openapi_text.splitlines():
        if line.strip() == "paths:":
            in_paths = True
            continue

        if in_paths and re.match(r"^[A-Za-z_][A-Za-z0-9_]*:\s*$", line):
            break

        match = re.match(r"^  (/[^:]+):\s*$", line)
        if in_paths and match:
            paths.add(match.group(1))

    return paths


def parse_openapi_operation_map(openapi_text: str) -> Dict[str, str]:
    operation_map: Dict[str, str] = {}
    in_paths = False
    current_path: str | None = None
    current_method: str | None = None

    for line in openapi_text.splitlines():
        if line.strip() == "paths:":
            in_paths = True
            continue

        if in_paths and re.match(r"^[A-Za-z_][A-Za-z0-9_]*:\s*$", line):
            break

        path_match = re.match(r"^  (/[^:]+):\s*$", line)
        if in_paths and path_match:
            current_path = path_match.group(1)
            current_method = None
            continue

        method_match = re.match(r"^    (get|post|put|delete|patch|head|options):\s*$", line)
        if in_paths and current_path and method_match:
            current_method = method_match.group(1).upper()
            continue

        op_match = re.match(r"^\s*operationId:\s*([A-Za-z0-9_]+)\s*$", line)
        if in_paths and current_path and current_method and op_match:
            operation_map[op_match.group(1)] = f"{current_method} {current_path}"

    return operation_map


def parse_asyncapi_message_blocks(asyncapi_text: str) -> Dict[str, str]:
    blocks: Dict[str, str] = {}
    in_messages = False
    current_name: str | None = None
    current_lines: List[str] = []

    for line in asyncapi_text.splitlines():
        if line.strip() == "messages:" and line.startswith("  "):
            in_messages = True
            continue

        if in_messages and re.match(r"^  [A-Za-z0-9_]+:\s*$", line):
            if current_name:
                blocks[current_name] = "\n".join(current_lines)
            break

        if not in_messages:
            continue

        message_start = re.match(r"^    ([A-Za-z0-9_]+):\s*$", line)
        if message_start:
            if current_name:
                blocks[current_name] = "\n".join(current_lines)
            current_name = message_start.group(1)
            current_lines = [line]
            continue

        if current_name:
            current_lines.append(line)

    if in_messages and current_name:
        blocks[current_name] = "\n".join(current_lines)

    return blocks


def extract_x_http_operation(block_text: str) -> str | None:
    match = re.search(r'^\s*x-http-operation:\s*"([^"]+)"\s*$', block_text, re.MULTILINE)
    return match.group(1) if match else None


def extract_capability_values(block_text: str) -> List[str]:
    if "x-capability-required:" not in block_text:
        return []

    tail = block_text.split("x-capability-required:", 1)[1]
    values: List[str] = []

    for line in tail.splitlines():
        capability_line = re.match(r"^\s*-\s*([A-Za-z0-9._-]+)\s*$", line)
        if capability_line:
            values.append(capability_line.group(1))
            continue

        if values and line.strip() and not line.lstrip().startswith("-"):
            break

    return values


def has_command_type_const(block_text: str) -> bool:
    return bool(re.search(r"command_type:\s*\n\s*const:\s*[^\n]+", block_text))


def is_command_message(message_name: str) -> bool:
    return message_name.endswith("Command")
