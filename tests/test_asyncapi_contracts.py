import re
import unittest

from tests.contract_utils import (
    extract_capability_values,
    extract_x_http_operation,
    has_command_type_const,
    is_command_message,
    parse_asyncapi_message_blocks,
    read_repo_file,
)


ASYNCAPI_FILES = [
    "docs/architecture/asyncapi/r3akt-core-lxmf.asyncapi.yaml",
    "docs/architecture/asyncapi/r3akt-analytics-lxmf.asyncapi.yaml",
    "docs/architecture/asyncapi/r3akt-gateway-lxmf.asyncapi.yaml",
    "docs/architecture/asyncapi/r3akt-agent-runtime-lxmf.asyncapi.yaml",
]


class TestAsyncAPIContracts(unittest.TestCase):
    def test_asyncapi_versions_and_channels(self) -> None:
        required_channels = {
            "docs/architecture/asyncapi/r3akt-core-lxmf.asyncapi.yaml": (
                "r3akt.core.commands",
                "r3akt.core.replies",
                "r3akt.core.events",
            ),
            "docs/architecture/asyncapi/r3akt-analytics-lxmf.asyncapi.yaml": (
                "r3akt.analytics.commands",
                "r3akt.analytics.replies",
                "r3akt.analytics.events",
            ),
            "docs/architecture/asyncapi/r3akt-gateway-lxmf.asyncapi.yaml": (
                "r3akt.gateway.commands",
                "r3akt.gateway.replies",
                "r3akt.gateway.events",
            ),
            "docs/architecture/asyncapi/r3akt-agent-runtime-lxmf.asyncapi.yaml": (
                "r3akt.agent.commands",
                "r3akt.agent.replies",
                "r3akt.agent.events",
            ),
        }

        for relative_path in ASYNCAPI_FILES:
            with self.subTest(spec=relative_path):
                text = read_repo_file(relative_path)
                self.assertIn('asyncapi: "2.6.0"', text)
                for channel in required_channels[relative_path]:
                    self.assertIn(channel, text)

    def test_every_command_has_http_mapping_capability_and_command_type(self) -> None:
        for relative_path in ASYNCAPI_FILES:
            with self.subTest(spec=relative_path):
                text = read_repo_file(relative_path)
                message_blocks = parse_asyncapi_message_blocks(text)
                command_names = [name for name in message_blocks if is_command_message(name)]
                self.assertGreater(len(command_names), 0, f"No command messages found in {relative_path}")

                for message_name in command_names:
                    block = message_blocks[message_name]
                    with self.subTest(spec=relative_path, message=message_name):
                        self.assertIsNotNone(extract_x_http_operation(block))
                        self.assertIn("x-capability-required:", block)
                        self.assertTrue(
                            len(extract_capability_values(block)) >= 1,
                            f"Expected at least one capability in {message_name}",
                        )
                        self.assertIn('$ref: "../schemas/command.json"', block)
                        self.assertTrue(has_command_type_const(block))

    def test_event_schema_is_referenced(self) -> None:
        for relative_path in ASYNCAPI_FILES:
            with self.subTest(spec=relative_path):
                text = read_repo_file(relative_path)
                self.assertRegex(text, re.compile(r'\$ref:\s*"\.\./schemas/event\.json"'))


if __name__ == "__main__":
    unittest.main()
