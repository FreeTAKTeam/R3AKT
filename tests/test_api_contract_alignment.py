import unittest

from tests.contract_utils import (
    extract_x_http_operation,
    is_command_message,
    parse_asyncapi_message_blocks,
    parse_openapi_operation_map,
    read_repo_file,
)


class TestAPIContractAlignment(unittest.TestCase):
    def test_core_openapi_paths_are_mapped_in_asyncapi_commands(self) -> None:
        openapi_map = parse_openapi_operation_map(
            read_repo_file("docs/architecture/openapi/r3akt-core-control.openapi.yaml")
        )
        asyncapi_blocks = parse_asyncapi_message_blocks(
            read_repo_file("docs/architecture/asyncapi/r3akt-core-lxmf.asyncapi.yaml")
        )

        mapped = {
            extract_x_http_operation(block)
            for name, block in asyncapi_blocks.items()
            if is_command_message(name)
        }
        mapped.discard(None)

        self.assertSetEqual(mapped, set(openapi_map.values()))

    def test_analytics_openapi_paths_are_mapped_in_asyncapi_commands(self) -> None:
        openapi_map = parse_openapi_operation_map(
            read_repo_file("docs/architecture/openapi/r3akt-analytics.openapi.yaml")
        )
        asyncapi_blocks = parse_asyncapi_message_blocks(
            read_repo_file("docs/architecture/asyncapi/r3akt-analytics-lxmf.asyncapi.yaml")
        )

        mapped = {
            extract_x_http_operation(block)
            for name, block in asyncapi_blocks.items()
            if is_command_message(name)
        }
        mapped.discard(None)

        self.assertSetEqual(mapped, set(openapi_map.values()))

    def test_agent_openapi_paths_are_mapped_in_asyncapi_commands(self) -> None:
        openapi_map = parse_openapi_operation_map(
            read_repo_file("docs/architecture/openapi/r3akt-agent-runtime.openapi.yaml")
        )
        asyncapi_blocks = parse_asyncapi_message_blocks(
            read_repo_file("docs/architecture/asyncapi/r3akt-agent-runtime-lxmf.asyncapi.yaml")
        )

        mapped = {
            extract_x_http_operation(block)
            for name, block in asyncapi_blocks.items()
            if is_command_message(name)
        }
        mapped.discard(None)

        self.assertSetEqual(mapped, set(openapi_map.values()))

    def test_gateway_commands_map_to_expected_http_surfaces(self) -> None:
        asyncapi_blocks = parse_asyncapi_message_blocks(
            read_repo_file("docs/architecture/asyncapi/r3akt-gateway-lxmf.asyncapi.yaml")
        )

        expected = {
            "CotConfigGetCommand": "GET /config (CoT gateway)",
            "CotConfigSetCommand": "PUT /config (CoT gateway)",
            "CotBridgeStatusGetCommand": "GET /bridge/status",
            "MeshtasticLinksListCommand": "GET /links",
            "MeshtasticConfigSetCommand": "PUT /config (Meshtastic gateway)",
        }

        for message_name, http_operation in expected.items():
            with self.subTest(message=message_name):
                self.assertIn(message_name, asyncapi_blocks)
                self.assertEqual(extract_x_http_operation(asyncapi_blocks[message_name]), http_operation)


if __name__ == "__main__":
    unittest.main()
