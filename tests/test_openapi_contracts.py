import unittest

from tests.contract_utils import parse_openapi_operation_map, parse_openapi_paths, read_repo_file


class TestOpenAPIContracts(unittest.TestCase):
    def test_core_control_paths_are_present(self) -> None:
        text = read_repo_file("docs/architecture/openapi/r3akt-core-control.openapi.yaml")
        paths = parse_openapi_paths(text)

        expected = {
            "/health",
            "/metrics",
            "/admin/identities",
            "/admin/identities/{identity}/revoke",
            "/admin/capabilities",
            "/admin/identities/{identity}/capabilities",
            "/topics",
            "/topics/{topic}/subscriptions",
            "/retention/policy",
            "/audit/search",
        }
        self.assertSetEqual(paths, expected)

    def test_auxiliary_openapi_specs_have_operation_ids(self) -> None:
        files = [
            "docs/architecture/openapi/r3akt-analytics.openapi.yaml",
            "docs/architecture/openapi/r3akt-agent-runtime.openapi.yaml",
            "docs/architecture/openapi/r3akt-cot-gateway.openapi.yaml",
            "docs/architecture/openapi/r3akt-meshtastic-gateway.openapi.yaml",
        ]

        for relative_path in files:
            with self.subTest(spec=relative_path):
                operation_map = parse_openapi_operation_map(read_repo_file(relative_path))
                self.assertGreater(len(operation_map), 0, f"No operations found in {relative_path}")
                self.assertEqual(
                    len(operation_map),
                    len(set(operation_map.keys())),
                    f"Duplicate operationId values found in {relative_path}",
                )

    def test_core_openapi_operation_count(self) -> None:
        text = read_repo_file("docs/architecture/openapi/r3akt-core-control.openapi.yaml")
        operation_map = parse_openapi_operation_map(text)
        self.assertEqual(len(operation_map), 14)


if __name__ == "__main__":
    unittest.main()
